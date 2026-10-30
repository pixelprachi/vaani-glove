import numpy as np
rng = np.random.default_rng(42)
N_PER_CLASS = 40
X, y = [], []
for cls in range(60):
    base = rng.normal(loc=cls / 60.0, scale=0.05, size=(22,))
    for _ in range(N_PER_CLASS):
        window = base + rng.normal(scale=0.03, size=(50, 22))
        X.append(window); y.append(cls)
X = np.array(X, dtype=np.float32)
y = np.array(y, dtype=np.int64)
np.savez("dataset.npz", X=X, y=y)
print("dataset.npz written:", X.shape, y.shape)