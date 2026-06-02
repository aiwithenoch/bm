import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure database directory and file exist with initial data
function initializeDatabase() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const defaultTracks = [
    {
      id: "track-1",
      title: "Theta Deep Meditation",
      description: "Binaural carrier wave set at 200Hz combined with a 4Hz differential offset. Ideal for inducing deep alpha-theta brain states, expanding creative visualization, and easing somatic tension.",
      duration: "15:00",
      frequency: "4.0 Hz",
      category: "theta",
      premium: true,
      synthType: "binaural",
      binauralCarrier: 200,
      binauralBeat: 4
    },
    {
      id: "track-2",
      title: "Alpha Focus Highway",
      description: "Binaural carrier wave set at 220Hz combined with a 10Hz offset. Optimizes attention density, accelerates information assimilation, and maintains creative composure during deep-work intervals.",
      duration: "20:00",
      frequency: "10.0 Hz",
      category: "alpha",
      premium: true,
      synthType: "binaural",
      binauralCarrier: 220,
      binauralBeat: 10
    },
    {
      id: "track-3",
      title: "Delta Restorative Cocoon",
      description: "binaural wave designed around a ultra-low 2.5Hz difference. Recommended for active sleep support, rapid athletic physical recovery, and deep slow-wave neuromodulation.",
      duration: "30:00",
      frequency: "2.5 Hz",
      category: "delta",
      premium: true,
      synthType: "binaural",
      binauralCarrier: 150,
      binauralBeat: 2.5
    },
    {
      id: "track-4",
      title: "Solfeggio 528Hz Cellular Healing",
      description: "Direct resonance frequency tuned perfectly to 528Hz. Often called the Frequency of Transformation, highly recommended for emotional equilibrium, physical reset, and stress relief.",
      duration: "12:00",
      frequency: "528 Hz",
      category: "solfeggio",
      premium: false, // Free track for anyone to try!
      synthType: "sine",
      synthHz: 528
    },
    {
      id: "track-5",
      title: "Gamma Cognitive Peak",
      description: "High-frequency binaural configuration designed at 40Hz with 250Hz carrier waves. Drives peak cognitive synthesis, enhanced focus resolution, and complex problem-solving acceleration.",
      duration: "10:00",
      frequency: "40.0 Hz",
      category: "gamma",
      premium: true,
      synthType: "binaural",
      binauralCarrier: 250,
      binauralBeat: 40
    }
  ];

  if (!fs.existsSync(DB_PATH)) {
    const initialDb = {
      users: [
        {
          id: "user-admin",
          email: "admin@brainmassage.co",
          password: "adminpassword", // In a real app we would hash passwords, but clean open-source text logic for simulation
          name: "Admin Host",
          role: "admin",
          subscriptionStatus: "monthly",
          subscriptionExpiresAt: "2030-12-31T23:59:59.000Z",
          createdAt: new Date().toISOString()
        },
        {
          id: "user-demo",
          email: "demo@user.com",
          password: "demouser",
          name: "Demo Listener",
          role: "user",
          subscriptionStatus: "none",
          subscriptionExpiresAt: null,
          createdAt: new Date().toISOString()
        }
      ],
      tracks: defaultTracks,
      leads: [],
      payments: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
  }
}

// Helper to read and write database with auto-expiry for test uploads after 30 minutes
function getDb() {
  initializeDatabase();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  // Perform 30 minutes cleanup for uploaded test tracks
  let changed = false;
  const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
  const defaultTrackIds = ["track-1", "track-2", "track-3", "track-4", "track-5"];
  
  if (db.tracks && Array.isArray(db.tracks)) {
    const originalLength = db.tracks.length;
    db.tracks = db.tracks.filter((track: any) => {
      if (defaultTrackIds.includes(track.id)) {
        return true; // Keep default pre-baked tracks
      }
      if (track.createdAt) {
        const createdTime = new Date(track.createdAt).getTime();
        if (!isNaN(createdTime) && createdTime < thirtyMinutesAgo) {
          changed = true;
          return false; // delete expired test track
        }
      }
      return true;
    });
  }
  
  if (changed) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  }
  
  return db;
}

function saveDb(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

async function startServer() {
  initializeDatabase();
  const app = express();

  // Support JSON payloads with increased limit for track simulation uploads (base64 audio)
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // API Middleware for Auth check (Extract user from header token)
  app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const db = getDb();
      // Token is just user-id in this simplified system
      const user = db.users.find((u: any) => u.id === token);
      if (user) {
        (req as any).user = user;
      }
    }
    next();
  });

  // --- API ROUTES ---

  // Auth: Email/Password Authentication
  app.post('/api/auth/register', (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        res.status(400).json({ error: 'All fields are strictly required.' });
        return;
      }

      const db = getDb();
      if (db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        res.status(400).json({ error: 'Email address is already registered.' });
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        email: email.toLowerCase(),
        password,
        name,
        role: 'user',
        subscriptionStatus: 'none',
        subscriptionExpiresAt: null,
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);
      saveDb(db);

      const { password: _, ...userSafe } = newUser;
      res.status(201).json({ user: userSafe, token: newUser.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }

      const db = getDb();
      const user = db.users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        res.status(401).json({ error: 'Invalid email or password credentials.' });
        return;
      }

      const { password: _, ...userSafe } = user;
      res.json({ user: userSafe, token: user.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Self Get
  app.get('/api/auth/me', (req, res) => {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized user session.' });
      return;
    }
    const { password: _, ...userSafe } = user;
    res.json(userSafe);
  });

  // Google OAuth Simulation
  app.post('/api/auth/google', (req, res) => {
    try {
      const { email, name, googleId } = req.body;
      const db = getDb();
      let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        user = {
          id: `user-google-${googleId || Date.now()}`,
          email: email.toLowerCase(),
          password: `oauth-${Date.now()}`,
          name,
          role: 'user',
          subscriptionStatus: 'none',
          subscriptionExpiresAt: null,
          createdAt: new Date().toISOString()
        };
        db.users.push(user);
        saveDb(db);
      }

      const { password: _, ...userSafe } = user;
      res.json({ user: userSafe, token: user.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Tracks: List Tracks
  app.get('/api/tracks', (req, res) => {
    try {
      const db = getDb();
      const user = (req as any).user;

      // Determine active subscription
      let hasActiveSubscription = false;
      if (user) {
        if (user.role === 'admin' || user.subscriptionStatus === 'monthly') {
          hasActiveSubscription = true;
        } else if (user.subscriptionStatus === 'day_pass' && user.subscriptionExpiresAt) {
          const expiresDate = new Date(user.subscriptionExpiresAt);
          if (expiresDate.getTime() > Date.now()) {
            hasActiveSubscription = true;
          }
        }
      }

      // Map tracks, marking premium ones as locked: true if user has no subscription
      const tracks = db.tracks.map((track: any) => {
        const isLocked = track.premium && !hasActiveSubscription;
        return {
          ...track,
          locked: isLocked
        };
      });

      res.json({ tracks, userHasActiveSubscription: hasActiveSubscription });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Only: Add new audio track
  app.post('/api/tracks/create', (req, res) => {
    try {
      const user = (req as any).user;
      if (!user || user.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Admin access strictly required.' });
        return;
      }

      const { title, description, duration, frequency, category, premium, synthType, synthHz, binauralCarrier, binauralBeat, audioData } = req.body;
      if (!title || !description || !duration || !frequency || !category) {
        res.status(400).json({ error: 'Missing mandatory fields.' });
        return;
      }

      const db = getDb();
      const newTrack = {
        id: `track-${Date.now()}`,
        title,
        description,
        duration,
        frequency,
        category,
        premium: premium === true || premium === 'true',
        synthType: synthType || 'binaural',
        synthHz: synthHz ? Number(synthHz) : undefined,
        binauralCarrier: binauralCarrier ? Number(binauralCarrier) : undefined,
        binauralBeat: binauralBeat ? Number(binauralBeat) : undefined,
        audioData: audioData || '', // Base64 raw audio standard
        createdAt: new Date().toISOString()
      };

      db.tracks.push(newTrack);
      saveDb(db);

      res.status(201).json({ message: 'Track compiled successfully.', track: newTrack });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Non-Technical Setup Contact Leads
  app.post('/api/leads', (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        res.status(400).json({ error: 'All lead submission fields are mandatory.' });
        return;
      }

      const db = getDb();
      const newLead = {
        id: `lead-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        message,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      db.leads.push(newLead);
      saveDb(db);

      res.status(201).json({ message: 'Managed integration request logged successfully.', lead: newLead });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Only: View Contact Leads
  app.get('/api/leads', (req, res) => {
    try {
      const user = (req as any).user;
      if (!user || user.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Admin access list restriction.' });
        return;
      }

      const db = getDb();
      res.json(db.leads || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Only: Update Lead status
  app.patch('/api/leads/:id', (req, res) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { status } = req.body;

      if (!user || user.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Admin access restriction.' });
        return;
      }

      const db = getDb();
      const leadIndex = db.leads.findIndex((l: any) => l.id === id);
      if (leadIndex === -1) {
        res.status(404).json({ error: 'Lead not found.' });
        return;
      }

      db.leads[leadIndex].status = status;
      saveDb(db);

      res.json({ message: 'Status updated successfully.', lead: db.leads[leadIndex] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Payments Simulators
  app.post('/api/payments/subscribe', (req, res) => {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Log in to obtain pricing pass.' });
        return;
      }

      const { type } = req.body; // 'day_pass' or 'monthly'
      if (type !== 'day_pass' && type !== 'monthly') {
        res.status(400).json({ error: 'Invalid subscription level category select.' });
        return;
      }

      const db = getDb();
      const userIndex = db.users.findIndex((u: any) => u.id === user.id);
      if (userIndex === -1) {
        res.status(404).json({ error: 'Account session records lost.' });
        return;
      }

      let expiresAt = new Date();
      if (type === 'day_pass') {
        expiresAt.setHours(expiresAt.getHours() + 24);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      const userRecord = db.users[userIndex];
      userRecord.subscriptionStatus = type;
      userRecord.subscriptionExpiresAt = expiresAt.toISOString();

      const paymentRecord = {
        id: `pay-${Date.now()}`,
        userId: user.id,
        userEmail: user.email,
        type,
        amount: type === 'day_pass' ? 2 : 25,
        status: 'succeeded',
        createdAt: new Date().toISOString()
      };

      db.payments.push(paymentRecord);
      db.users[userIndex] = userRecord;
      saveDb(db);

      res.json({
        message: `Successfully purchased ${type === 'day_pass' ? '1-Day Access Pass' : 'Monthly Premium Membership'}!`,
        user: {
          id: userRecord.id,
          email: userRecord.email,
          name: userRecord.name,
          role: userRecord.role,
          subscriptionStatus: userRecord.subscriptionStatus,
          subscriptionExpiresAt: userRecord.subscriptionExpiresAt,
          createdAt: userRecord.createdAt
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite Integration for Dev / Serving Built Dist on production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Handle all fallback errors on general runtime
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandle exception caught:", err);
    res.status(500).json({ error: 'A serious internal server exception has occurred.' });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Open-Source Brain Massage server running successfully on port ${PORT}`);
  });
}

startServer();
