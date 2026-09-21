import admin from 'firebase-admin';

// 1. Obtener la clave de cuenta de servicio desde las variables de entorno de GitHub Actions
const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountRaw) {
  console.error('❌ ERROR: Variable FIREBASE_SERVICE_ACCOUNT_KEY no encontrada en el entorno.');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountRaw);
} catch (err) {
  console.error('❌ ERROR: No se pudo parsear el JSON de FIREBASE_SERVICE_ACCOUNT_KEY:', err);
  process.exit(1);
}

// 2. Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id || 'forms-nl',
  });
}

const db = admin.firestore();
const messaging = admin.messaging();

async function runNotifications() {
  console.log('🚀 Iniciando escaneo de nuevas respuestas en Firestore...');

  try {
    // 3. Buscar respuestas no notificadas
    const snapshot = await db
      .collection('respuestas_caracterizacion')
      .where('notificado', '!=', true)
      .limit(50)
      .get();

    if (snapshot.empty) {
      console.log('✅ No hay nuevas respuestas pendientes de notificación.');
      return;
    }

    console.log(`📦 Se encontraron ${snapshot.docs.length} nuevas respuestas.`);

    // 4. Obtener tokens de dispositivos de administración registrados
    const tokensSnap = await db.collection('admin_push_tokens').get();
    const pushTokens = [];
    tokensSnap.forEach((doc) => {
      const data = doc.data();
      if (data.token) pushTokens.push(data.token);
    });

    console.log(`📱 Tokens de dispositivos activos para notificaciones Push: ${pushTokens.length}`);

    for (const docSnap of snapshot.docs) {
      const form = docSnap.data();
      const childName = form.nombreCompleto || form.nombreNino || 'Nuevo infante';
      const folio = form.folio || docSnap.id;
      const age = form.edadAnos ? `${form.edadAnos} años, ${form.edadMeses || 0} meses` : 'Edad no especificada';

      console.log(`🔔 Procesando: ${childName} (Folio: ${folio})`);

      // 5. Enviar Notificación Push si hay tokens de dispositivos registrados
      if (pushTokens.length > 0) {
        try {
          const message = {
            notification: {
              title: `🌟 Nuevo Registro: ${childName}`,
              body: `Folio: ${folio} • Edad: ${age} • Toca para revisar en el Panel.`,
            },
            data: {
              folio: folio,
              docId: docSnap.id,
              url: 'https://forms-nl.web.app/?Respuestas',
            },
            tokens: pushTokens,
          };

          const response = await messaging.sendEachForMulticast(message);
          console.log(`📲 Notificaciones enviadas con éxito: ${response.successCount}/${pushTokens.length}`);
        } catch (pushErr) {
          console.error('⚠️ Error al enviar push notification:', pushErr.message);
        }
      }

      // 6. Marcar documento como notificado en Firestore
      await docSnap.ref.update({
        notificado: true,
        fechaNotificacion: new Date().toISOString(),
        notificadoPor: 'github_actions_runner',
      });
      console.log(`✔️ Documento ${docSnap.id} marcado como notificado.`);
    }

    console.log('🎉 Proceso de notificaciones completado con éxito.');
  } catch (error) {
    console.error('❌ Error en el backend de notificaciones:', error);
    process.exit(1);
  }
}

runNotifications();
