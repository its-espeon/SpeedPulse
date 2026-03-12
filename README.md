# 🌐 Internet Speed Test

A simple **browser-based Internet Speed Test** built using **JavaScript, HTML, and CSS**.
It measures **Ping, Download Speed, and Upload Speed** and also displays the user's **IP address and ISP information**.

## 🚀 Features

* 📡 Detects **Public IP Address**
* 🌍 Shows **ISP and Location**
* ⚡ Measures **Ping (Latency)**
* ⬇️ Measures **Download Speed**
* ⬆️ Simulates **Upload Speed**
* 📊 Animated **Progress Bars**
* 🖥️ Clean and responsive UI

  
## 📸 Demo
Click **Start Test** to measure your internet connection speed.
The application will display:
* Ping (ms)
* Download speed (Mbps)
* Upload speed (Mbps)
* Public IP address
* ISP information

## 🛠️ Technologies Used
* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Fetch API
* Cloudflare Speed Test Endpoint
* ipapi.co API

## 📂 Project Structure
```
internet-speed-test/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## ⚙️ How It Works
### 1️⃣ IP Address Detection
The application fetches IP details using:
```
https://ipapi.co/json/
```
If it fails, it falls back to:
```
https://api.ipify.org
```

### 2️⃣ Ping Test
Ping is measured by sending multiple small requests to Cloudflare's speed test endpoint:

```
https://speed.cloudflare.com/__down?bytes=0
```

### 3️⃣ Download Speed Test

A **15MB file** is downloaded from Cloudflare servers.

Speed is calculated using:

```
Speed = Data Downloaded / Time Taken
```

Result is shown in **Mbps**.

### 4️⃣ Upload Speed Test

For demonstration purposes, upload speed is **simulated** since public upload test endpoints are limited due to CORS restrictions.

In production environments, this would require:

* Dedicated backend server
* WebSockets
* WebRTC data channels

## ▶️ How to Run
1. Clone the repository
```bash
git clone https://github.com/yourusername/internet-speed-test.git
```
2. Navigate into the project
```bash
cd internet-speed-test
```
3. Open `index.html` in your browser.

## ⚠️ Limitations
* Upload speed is **simulated**
* Accuracy depends on:
  * Network conditions
  * Browser performance
  * Distance to Cloudflare servers

## 🔮 Future Improvements
* Real upload speed test
* Server selection
* Speed test history
* Dark mode
* Mobile optimization
* Graph visualization

## 👨‍💻 Author

Developed by **Akshay Santhosh (its-espeon)**

If you found this project useful, consider ⭐ starring the repository!
