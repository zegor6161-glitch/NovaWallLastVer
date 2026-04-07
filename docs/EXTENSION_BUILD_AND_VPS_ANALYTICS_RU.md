# Подробная инструкция: как скачать архив проекта, собрать расширение **с локальными `crypto-libs-snapshot`**, и настроить VPS для приема аналитики

> Эта инструкция ориентирована на сборку из архива (ZIP/TAR.GZ) и на контроль того, что используются именно библиотеки из `crypto-libs-snapshot`, а не «обычные» версии из npm.

---

## Быстрый старт для Windows PowerShell (коротко)

1. Перейдите в корень проекта:

```powershell
cd "C:\Users\DC\Downloads\NovaWallLastVer-main (2)\NovaWallLastVer-main"
```

2. Проверьте, что папка snapshot есть:

```powershell
if (Test-Path ".\crypto-libs-snapshot" -PathType Container) { "OK" } else { "ERROR: no snapshot" }
```

3. Проверьте ключевые snapshot-файлы:

```powershell
Test-Path ".\crypto-libs-snapshot\@noble\curves\esm\secp256k1.js" -PathType Leaf
Test-Path ".\crypto-libs-snapshot\tiny-secp256k1\lib\secp256k1.wasm" -PathType Leaf
```

Обе команды должны вернуть `True`.

4. Установите endpoint аналитики (ваш VPS):

```powershell
$env:VITE_ANALYTICS_ENDPOINT = "https://analytics.example.com/product-events"
Remove-Item Env:VITE_CWS_REVIEW_BUILD -ErrorAction SilentlyContinue
```

5. Установите зависимости и соберите:

```powershell
yarn install
yarn build:all
cd .\packages\extension
yarn build:chrome
```

6. Проверьте alias на локальный snapshot:

```powershell
rg -n "crypto-libs-snapshot/@noble/curves/esm" .\vite.config.ts
```

7. Загрузите расширение из папки:

`packages/extension/dist`

---

## 1) Что вы получите в итоге

После выполнения шагов у вас будет:

1. Локальная копия проекта из архива на компьютере.
2. Собранное браузерное расширение (Chrome/Chromium) в `packages/extension/dist`.
3. VPS с HTTPS endpoint для приема продуктовой аналитики расширения.
4. Сборка, где endpoint аналитики принудительно направлен на ваш VPS через `VITE_ANALYTICS_ENDPOINT`.
5. Чек-лист проверок, что в сборке реально используются локальные снапшот-библиотеки из `crypto-libs-snapshot`.

---

## 2) Важные технические факты из проекта (почему это работает)

В этом репозитории уже есть механизм, который направляет импорты `@noble/curves` в локальную папку `crypto-libs-snapshot` через alias в Vite-конфиге (`packages/extension/vite.config.ts`).

Также endpoint продуктовой аналитики читается из переменной окружения `VITE_ANALYTICS_ENDPOINT` (`packages/extension/src/libs/analytics/index.ts`).

Дополнительно существует «legacy» канал метрик на `/record` (Amplitude-совместимый) в `packages/extension/src/libs/metrics/amplitude.ts`. Поэтому на VPS лучше подготовить оба маршрута:

- `/product-events` — обязательно;
- `/record` — желательно (для полноты и совместимости).

---

## 3) Скачивание архива проекта на компьютер

### Вариант A (через GitHub UI)

1. Откройте страницу репозитория.
2. Нажмите **Code → Download ZIP**.
3. Сохраните архив, например в `~/Downloads`.
4. Распакуйте:

```bash
cd ~/Downloads
unzip enKrypt-main.zip -d ~/projects
cd ~/projects/enKrypt-main
```

### Вариант B (через терминал)

```bash
mkdir -p ~/projects && cd ~/projects
curl -L -o enkrypt.zip https://github.com/enkryptcom/enKrypt/archive/refs/heads/main.zip
unzip enkrypt.zip
cd enKrypt-main
```

> Если у вас не `main` ветка, используйте нужный архив с вашей веткой/тегом.

---

## 4) Проверка, что в архиве есть `crypto-libs-snapshot`

> Ниже в каждом блоке есть команды и для **bash/zsh (macOS/Linux)**, и для **PowerShell (Windows)**.

Сразу после распаковки выполните:

**bash/zsh:**

```bash
test -d crypto-libs-snapshot && echo "OK: crypto-libs-snapshot найден" || echo "ERROR: папка отсутствует"
```

**PowerShell:**

```powershell
if (Test-Path ".\crypto-libs-snapshot" -PathType Container) {
  Write-Host "OK: crypto-libs-snapshot найден"
} else {
  Write-Host "ERROR: папка отсутствует"
}
```

Проверка ключевых файлов снапшота:

**bash/zsh:**

```bash
test -f crypto-libs-snapshot/@noble/curves/esm/secp256k1.js && echo "OK: local noble curves"
test -f crypto-libs-snapshot/tiny-secp256k1/lib/secp256k1.wasm && echo "OK: local tiny-secp256k1 wasm"
```

**PowerShell:**

```powershell
if (Test-Path ".\crypto-libs-snapshot\@noble\curves\esm\secp256k1.js" -PathType Leaf) {
  Write-Host "OK: local noble curves"
} else {
  Write-Host "ERROR: secp256k1.js не найден"
}

if (Test-Path ".\crypto-libs-snapshot\tiny-secp256k1\lib\secp256k1.wasm" -PathType Leaf) {
  Write-Host "OK: local tiny-secp256k1 wasm"
} else {
  Write-Host "ERROR: secp256k1.wasm не найден"
}
```

Если хотя бы одна проверка не проходит — архив неполный, сборку продолжать нельзя.

---

## 5) Подготовка окружения на локальной машине

Требования (по проекту):

- Node.js 20 (через nvm)
- Yarn

Команды:

```bash
nvm install 20
nvm use 20
npm install -g yarn
```

Установка зависимостей в корне проекта:

```bash
yarn install
```

---

## 6) Сборка расширения с принудительным endpoint аналитики на ваш VPS

### 6.1. Задайте endpoint аналитики

Пример (подставьте ваш домен):

```bash
export VITE_ANALYTICS_ENDPOINT="https://analytics.example.com/product-events"
```

> Важно: `https://` обязателен, иначе транспорт не создастся.

### 6.2. Убедитесь, что НЕ включен review-режим

В review-режиме телеметрия отключается. Проверьте:

```bash
echo "VITE_CWS_REVIEW_BUILD=${VITE_CWS_REVIEW_BUILD:-<empty>}"
```

Если переменная установлена в `true`/`1`/`yes`/`on`, уберите её:

```bash
unset VITE_CWS_REVIEW_BUILD
```

### 6.3. Соберите все пакеты и extension

```bash
yarn build:all
cd packages/extension
yarn build:chrome
```

Результат: `packages/extension/dist`.

---

## 7) Критично: как проверить, что используются именно `crypto-libs-snapshot`

Ниже практический контроль (делайте все пункты).

### Проверка 1: alias в Vite-конфиге

Проверьте, что mapping указывает на `../../crypto-libs-snapshot/@noble/curves/esm/...`:

**bash/zsh и PowerShell (одинаково):**

```bash
rg -n "crypto-libs-snapshot/@noble/curves/esm" packages/extension/vite.config.ts
```

### Проверка 2: в собранном `dist` есть следы local noble curves

**bash/zsh:**

```bash
rg -n "secp256k1|p256|ed25519" packages/extension/dist | head
```

**PowerShell:**

```powershell
rg -n "secp256k1|p256|ed25519" packages/extension/dist | Select-Object -First 20
```

### Проверка 3: «негативная» проверка

Проверьте, что в `vite.config.ts` нет alias обратно в `node_modules/@noble/curves`:

**bash/zsh:**

```bash
rg -n "node_modules/@noble/curves" packages/extension/vite.config.ts || echo "OK: alias на node_modules не найден"
```

**PowerShell:**

```powershell
$res = rg -n "node_modules/@noble/curves" packages/extension/vite.config.ts
if ($LASTEXITCODE -eq 0) {
  $res
} else {
  Write-Host "OK: alias на node_modules не найден"
}
```

### Проверка 4 (рекомендуется): временно сломайте snapshot-файл

Это самый надежный smoke-test на локальной машине:

1. Переименуйте файл:

**bash/zsh:**

```bash
mv crypto-libs-snapshot/@noble/curves/esm/secp256k1.js crypto-libs-snapshot/@noble/curves/esm/secp256k1.js.bak
```

**PowerShell:**

```powershell
Move-Item ".\crypto-libs-snapshot\@noble\curves\esm\secp256k1.js" ".\crypto-libs-snapshot\@noble\curves\esm\secp256k1.js.bak"
```

2. Повторите сборку extension.
3. Если сборка падает — отлично, значит реально используется local snapshot.
4. Верните файл обратно:

**bash/zsh:**

```bash
mv crypto-libs-snapshot/@noble/curves/esm/secp256k1.js.bak crypto-libs-snapshot/@noble/curves/esm/secp256k1.js
```

**PowerShell:**

```powershell
Move-Item ".\crypto-libs-snapshot\@noble\curves\esm\secp256k1.js.bak" ".\crypto-libs-snapshot\@noble\curves\esm\secp256k1.js"
```

---

## 8) Установка расширения в браузер

1. Откройте `chrome://extensions`.
2. Включите **Developer mode**.
3. Нажмите **Load unpacked**.
4. Укажите папку: `packages/extension/dist`.

---

## 9) Настройка VPS для приема аналитики

Ниже — рабочий минимальный production-шаблон: `Nginx + Node.js collector`.

## 9.1. DNS и TLS

1. Создайте A-запись: `analytics.example.com -> IP VPS`.
2. Откройте порты 80/443 в firewall.
3. Выпустите сертификат Let's Encrypt.

### 9.2. Пример Node.js collector

На VPS:

```bash
mkdir -p /opt/enkrypt-analytics && cd /opt/enkrypt-analytics
npm init -y
npm i express
```

Создайте `server.js`:

```js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '1mb' }));

const dataDir = '/var/log/enkrypt-analytics';
fs.mkdirSync(dataDir, { recursive: true });

function appendLine(file, payload) {
  fs.appendFileSync(path.join(dataDir, file), JSON.stringify(payload) + '\n', 'utf8');
}

app.post('/product-events', (req, res) => {
  // Сохраняем минимально необходимые данные; не логируйте чувствительное.
  appendLine('product-events.ndjson', {
    ts: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    ua: req.headers['user-agent'] || '',
    body: req.body,
  });
  res.status(202).json({ ok: true });
});

app.post('/record', (req, res) => {
  appendLine('record.ndjson', {
    ts: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    ua: req.headers['user-agent'] || '',
    body: req.body,
  });
  res.status(202).json({ ok: true });
});

app.get('/healthz', (_req, res) => res.status(200).send('ok'));

app.listen(8080, () => console.log('Analytics collector listening on :8080'));
```

Запуск через systemd (рекомендуется) или PM2.

### 9.3. Nginx reverse proxy

Файл `/etc/nginx/sites-available/analytics.example.com`:

```nginx
server {
    listen 80;
    server_name analytics.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name analytics.example.com;

    ssl_certificate /etc/letsencrypt/live/analytics.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/analytics.example.com/privkey.pem;

    client_max_body_size 1m;

    location /product-events {
        proxy_pass http://127.0.0.1:8080/product-events;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        limit_except POST { deny all; }
    }

    location /record {
        proxy_pass http://127.0.0.1:8080/record;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        limit_except POST { deny all; }
    }

    location /healthz {
        proxy_pass http://127.0.0.1:8080/healthz;
    }
}
```

Активируйте конфиг:

```bash
ln -s /etc/nginx/sites-available/analytics.example.com /etc/nginx/sites-enabled/analytics.example.com
nginx -t
systemctl reload nginx
```

---

## 10) Проверка, что VPS действительно принимает события

### 10.1. Проверка напрямую с сервера

```bash
curl -i http://127.0.0.1:8080/healthz
```

Ожидается `200 ok`.

### 10.2. Проверка через публичный HTTPS endpoint

```bash
curl -i https://analytics.example.com/product-events \
  -H "Content-Type: application/json" \
  -d '{"event":"test_event","properties":{"source":"manual"}}'
```

Ожидается `202`.

### 10.3. Проверка логов

```bash
tail -n 5 /var/log/enkrypt-analytics/product-events.ndjson
```

---

## 11) Проверка отправки аналитики из самого расширения

1. Запустите расширение.
2. В настройках кошелька включите Usage analytics.
3. Выполните действие, которое трекается (например создание/импорт/переключение сети).
4. На VPS проверьте, что появились новые записи в `product-events.ndjson`.

---

## 12) Частые ошибки и как исправить

1. **События не уходят вообще**
   - Проверьте, что `VITE_CWS_REVIEW_BUILD` не включен.
   - Проверьте, что endpoint начинается с `https://`.

2. **Уходит на дефолтный домен, а не на ваш VPS**
   - Значит `VITE_ANALYTICS_ENDPOINT` не был выставлен в момент сборки.
   - Пересоберите extension после `export VITE_ANALYTICS_ENDPOINT=...`.

3. **Сборка проходит даже при удалении snapshot-файла**
   - Проверьте, что вы тестируете именно extension-сборку из `packages/extension`.
   - Проверьте alias в `packages/extension/vite.config.ts`.

4. **TLS/сертификат ошибка**
   - Проверьте DNS, что домен указывает на VPS.
   - Убедитесь, что certbot выпустил сертификат именно на нужный `server_name`.

---

## 13) Рекомендуемый production hardening для аналитики

- Ограничить методы только `POST` на ingestion endpoints.
- Включить rate limiting в Nginx.
- Добавить basic WAF правила (например блок аномально больших тел).
- Настроить ротацию логов (`logrotate`) для `/var/log/enkrypt-analytics/*.ndjson`.
- Вынести хранение в БД/ClickHouse/BigQuery при росте объема.
- Добавить мониторинг доступности `/healthz`.

---

## 14) Минимальный чек-лист перед релизом

- [ ] Архив распакован полностью, папка `crypto-libs-snapshot` присутствует.
- [ ] Alias в `vite.config.ts` указывает на `../../crypto-libs-snapshot/@noble/curves/esm/...`.
- [ ] `VITE_ANALYTICS_ENDPOINT` указывает на ваш `https://.../product-events`.
- [ ] `VITE_CWS_REVIEW_BUILD` не активирован.
- [ ] VPS принимает `POST /product-events` (код `202`).
- [ ] После действий в UI расширения на VPS появляются записи analytics.

---

Если нужно, могу сделать второй документ: «эталонный production-вариант с Docker Compose (Nginx + collector + ClickHouse + Grafana)» с готовыми конфигами под копипаст.
