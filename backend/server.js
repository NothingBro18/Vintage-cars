import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, 'data', 'cars.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(16).slice(2)}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

const loadCars = async () => {
  try {
    const file = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(file);
  } catch (error) {
    console.error('Failed to load car data:', error);
    return [];
  }
};

const saveCars = async (cars) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(cars, null, 2), 'utf-8');
};

app.get('/api/cars', async (req, res) => {
  const cars = await loadCars();
  res.json(cars);
});

app.get('/api/cars/:id', async (req, res) => {
  const cars = await loadCars();
  const id = Number(req.params.id);
  const car = cars.find((item) => item.id === id);

  if (!car) {
    return res.status(404).json({ error: 'Car not found' });
  }

  res.json(car);
});

app.post('/api/cars', upload.array('images', 5), async (req, res) => {
  const cars = await loadCars();
  const body = req.body;
  const files = req.files || [];
  const imagePaths = files.map((file) => `/uploads/${path.basename(file.path)}`);

  if (!body || !body.name || !body.brand || (imagePaths.length === 0 && !body.image)) {
    return res.status(400).json({ error: 'Name, brand, and image are required' });
  }

  const nextId = cars.length > 0 ? Math.max(...cars.map((car) => car.id)) + 1 : 1;
  let extraImages = [];
  if (body.image) extraImages.push(body.image);
  if (body.images) {
    try {
      const parsedImages = JSON.parse(body.images);
      if (Array.isArray(parsedImages)) {
        extraImages = [...extraImages, ...parsedImages];
      }
    } catch (error) {
      // Ignore invalid JSON image array
    }
  }
  const carToAdd = {
    id: nextId,
    name: body.name,
    brand: body.brand,
    model: body.model || '',
    year: Number(body.year) || new Date().getFullYear(),
    details: body.details || '',
    price: body.price || '',
    address: body.address || '',
    engine: body.engine || '',
    horsepower: body.horsepower || '',
    topSpeed: body.topSpeed || '',
    image: imagePaths[0] || extraImages[0] || '',
    images: imagePaths.length > 0 ? imagePaths : extraImages,
  };

  cars.unshift(carToAdd);
  await saveCars(cars);

  res.status(201).json(carToAdd);
});

app.delete('/api/cars/:id', async (req, res) => {
  const cars = await loadCars();
  const id = Number(req.params.id);
  const index = cars.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Car not found' });
  }

  const [removedCar] = cars.splice(index, 1);
  await saveCars(cars);

  res.json({ success: true, car: removedCar });
});

app.put('/api/cars/:id', async (req, res) => {
  const cars = await loadCars();
  const id = Number(req.params.id);
  const index = cars.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Car not found' });
  }

  const updatedCar = { ...cars[index], ...req.body, id };
  cars[index] = updatedCar;
  await saveCars(cars);

  res.json(updatedCar);
});

const startServer = async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    app.listen(process.env.PORT || 4000, () => {
      console.log('Vintage car backend listening on port', process.env.PORT || 4000);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
};

startServer();
