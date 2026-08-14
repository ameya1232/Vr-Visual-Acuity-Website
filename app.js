// Firebase config
const firebaseConfig = {
	apiKey: "AIzaSyAcPhlsGZepoakFV6mEH4xEZ0iWqZfxiCw",
	authDomain: "prakash-f9bf4.firebaseapp.com",
	databaseURL:
		"https://prakash-f9bf4-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "prakash-f9bf4",
	storageBucket: "prakash-f9bf4.appspot.com",
	messagingSenderId: "3154372934",
	appId: "1:3154372934:web:8e26c0166595e49c619d47",
	measurementId: "G-WS3CMWSQDH",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();
const auth = firebase.auth();

// Authentication state
let currentUser = null;

// Hardcoded PIN (you can change this or store it in Firebase)
const CORRECT_PIN = "123456"; // Change this to your desired PIN

const appDiv = document.getElementById("app");

// Authentication functions
function loginScreen() {
	appDiv.innerHTML = `
		<div class="anime-bg" style="min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;background:linear-gradient(135deg, #000 0%, #1a1a1a 50%, #333 100%);padding:20px;position:relative;overflow:hidden;">
			<!-- Floating particles -->
			<div class="particles">
				<div class="particle"></div>
				<div class="particle"></div>
				<div class="particle"></div>
				<div class="particle"></div>
				<div class="particle"></div>
			</div>
			
			<!-- Main login card -->
			<div class="login-card" style="background:#fff;border:4px solid #000;border-radius:20px;padding:40px;max-width:400px;width:90%;display:flex;flex-direction:column;align-items:center;position:relative;box-shadow:0 0 0 8px #fff, 0 0 0 12px #000;animation:cardFloat 3s ease-in-out infinite;">
				
				<!-- Anime character icon -->
				<div class="character-icon" style="width:120px;height:120px;background:#000;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:20px;position:relative;animation:bounce 2s ease-in-out infinite;">
					<div style="width:80px;height:80px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative;">
						<!-- Anime eyes -->
						<div style="position:absolute;top:25px;left:20px;width:12px;height:12px;background:#000;border-radius:50%;animation:blink 3s infinite;"></div>
						<div style="position:absolute;top:25px;right:20px;width:12px;height:12px;background:#000;border-radius:50%;animation:blink 3s infinite 0.1s;"></div>
						<!-- Smile -->
						<div style="position:absolute;bottom:20px;width:30px;height:15px;border:3px solid #000;border-top:none;border-radius:0 0 15px 15px;"></div>
					</div>
					<!-- Character accessories -->
					<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:15px solid transparent;border-right:15px solid transparent;border-bottom:20px solid #000;"></div>
				</div>
				
				<h1 class="anime-title" style="text-align:center;font-size:2.5rem;font-weight:900;color:#000;margin-bottom:8px;font-family:'Comic Sans MS', cursive;text-shadow:3px 3px 0 #fff, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;animation:titlePulse 2s ease-in-out infinite;">SECURE ACCESS!</h1>
				
				<p style="text-align:center;color:#333;margin-bottom:30px;font-size:1.1rem;font-weight:600;font-family:'Comic Sans MS', cursive;">Enter the secret PIN to unlock the portal! ✨</p>
				
				<form id="loginForm" style="width:100%;display:flex;flex-direction:column;gap:20px;">
					<div style="position:relative;">
						<input type="password" id="pinInput" placeholder="🔐 Secret PIN" style="width:100%;padding:18px 20px;font-size:1.3rem;border:4px solid #000;border-radius:15px;text-align:center;letter-spacing:4px;font-weight:800;background:#f8f8f8;font-family:'Comic Sans MS', cursive;transition:all 0.3s ease;" maxlength="10" required>
						<div class="input-sparkles" style="position:absolute;top:-5px;right:-5px;width:20px;height:20px;background:#000;border-radius:50%;animation:sparkle 1.5s ease-in-out infinite;"></div>
					</div>
					<button type="submit" id="loginBtn" class="anime-btn" style="width:100%;padding:18px 0;font-size:1.2rem;background:#000;color:#fff;border:4px solid #000;border-radius:15px;font-weight:800;cursor:pointer;font-family:'Comic Sans MS', cursive;position:relative;overflow:hidden;transition:all 0.3s ease;">
						<span id="loginBtnText" style="position:relative;z-index:2;">🚀 ENTER PORTAL!</span>
						<div id="loginSpinner" style="display:none;width:24px;height:24px;border:3px solid #ffffff40;border-top:3px solid #fff;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto;"></div>
						<div class="btn-shine" style="position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);transition:left 0.5s ease;"></div>
					</button>
				</form>
				
				<div id="loginError" class="error-bubble" style="color:#000;margin-top:16px;text-align:center;display:none;padding:15px;background:#fff;border:3px solid #000;border-radius:20px;font-weight:700;font-family:'Comic Sans MS', cursive;position:relative;"></div>
				
				<!-- Decorative elements -->
				<div class="deco-star" style="position:absolute;top:10px;right:15px;font-size:1.5rem;animation:twinkle 2s ease-in-out infinite;">⭐</div>
				<div class="deco-star" style="position:absolute;bottom:15px;left:10px;font-size:1.2rem;animation:twinkle 2s ease-in-out infinite 0.5s;">✨</div>
			</div>
		</div>
		
		<style>
			@import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&display=swap');
			
			* {
				box-sizing: border-box;
			}
			
			@keyframes cardFloat {
				0%, 100% { transform: translateY(0px) rotate(0deg); }
				50% { transform: translateY(-10px) rotate(1deg); }
			}
			
			@keyframes bounce {
				0%, 100% { transform: translateY(0px); }
				50% { transform: translateY(-8px); }
			}
			
			@keyframes blink {
				0%, 90%, 100% { transform: scaleY(1); }
				95% { transform: scaleY(0.1); }
			}
			
			@keyframes titlePulse {
				0%, 100% { transform: scale(1); }
				50% { transform: scale(1.05); }
			}
			
			@keyframes sparkle {
				0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
				50% { transform: scale(1.2) rotate(180deg); opacity: 0.7; }
			}
			
			@keyframes twinkle {
				0%, 100% { opacity: 1; transform: scale(1); }
				50% { opacity: 0.5; transform: scale(1.2); }
			}
			
			@keyframes spin {
				0% { transform: rotate(0deg); }
				100% { transform: rotate(360deg); }
			}
			
			@keyframes particleFloat {
				0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
				10% { opacity: 1; }
				90% { opacity: 1; }
				100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
			}
			
			.particles {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				pointer-events: none;
			}
			
			.particle {
				position: absolute;
				width: 6px;
				height: 6px;
				background: #fff;
				border-radius: 50%;
				animation: particleFloat 8s linear infinite;
			}
			
			.particle:nth-child(1) { left: 20%; animation-delay: 0s; }
			.particle:nth-child(2) { left: 40%; animation-delay: 2s; }
			.particle:nth-child(3) { left: 60%; animation-delay: 4s; }
			.particle:nth-child(4) { left: 80%; animation-delay: 6s; }
			.particle:nth-child(5) { left: 90%; animation-delay: 1s; }
			
			#pinInput:focus {
				outline: none;
				border-color: #000;
				background: #fff;
				transform: scale(1.02);
				box-shadow: 0 0 20px rgba(0,0,0,0.3);
			}
			
			.anime-btn:hover {
				transform: translateY(-3px);
				box-shadow: 0 8px 15px rgba(0,0,0,0.3);
				background: #333;
			}
			
			.anime-btn:hover .btn-shine {
				left: 100%;
			}
			
			.error-bubble::before {
				content: '💥';
				position: absolute;
				top: -10px;
				left: 10px;
				font-size: 1.5rem;
			}
			
			/* Responsive Design */
			@media (max-width: 768px) {
				.login-card {
					padding: 30px 20px !important;
					margin: 0 10px;
				}
				
				.anime-title {
					font-size: 2rem !important;
				}
				
				.character-icon {
					width: 100px !important;
					height: 100px !important;
				}
				
				#pinInput {
					font-size: 1.1rem !important;
					padding: 15px !important;
				}
				
				.anime-btn {
					padding: 15px 0 !important;
					font-size: 1.1rem !important;
				}
			}
			
			@media (max-width: 480px) {
				.anime-title {
					font-size: 1.8rem !important;
				}
				
				.character-icon {
					width: 80px !important;
					height: 80px !important;
				}
			}
		</style>
	`;

	const form = document.getElementById("loginForm");
	const pinInput = document.getElementById("pinInput");
	const errorDiv = document.getElementById("loginError");
	const loginBtn = document.getElementById("loginBtn");
	const loginBtnText = document.getElementById("loginBtnText");
	const loginSpinner = document.getElementById("loginSpinner");

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const pin = pinInput.value.trim();

		if (!pin) {
			showError("Please enter your PIN");
			return;
		}

		// Show loading state
		setLoadingState(true);

		try {
			if (pin === CORRECT_PIN) {
				// Create a dummy user session with Firebase Auth
				console.log("PIN correct, attempting Firebase Auth...");
				const userCredential = await auth.signInAnonymously();
				console.log(
					"Firebase Auth successful:",
					userCredential.user.uid
				);

				// Store authentication in localStorage as backup
				localStorage.setItem("gameDataAuth", "authenticated");
				localStorage.setItem("gameDataAuthTime", Date.now().toString());

				// Success - redirect to main app
				currentUser = auth.currentUser;
				console.log(
					"Authentication complete, redirecting to home screen"
				);
				homeScreen();
			} else {
				throw new Error("Invalid PIN");
			}
		} catch (error) {
			console.error("Authentication error:", error);
			if (error.code) {
				console.error("Firebase error code:", error.code);
				console.error("Firebase error message:", error.message);
			}
			showError("Authentication failed. Please try again.");
			pinInput.value = "";
		} finally {
			setLoadingState(false);
		}
	});

	function showError(message) {
		errorDiv.textContent = message;
		errorDiv.style.display = "block";
		pinInput.style.borderColor = "#e53e3e";
		setTimeout(() => {
			errorDiv.style.display = "none";
			pinInput.style.borderColor = "#e2e8f0";
		}, 4000);
	}

	function setLoadingState(loading) {
		if (loading) {
			loginBtn.disabled = true;
			loginBtn.style.opacity = "0.8";
			loginBtnText.style.display = "none";
			loginSpinner.style.display = "block";
		} else {
			loginBtn.disabled = false;
			loginBtn.style.opacity = "1";
			loginBtnText.style.display = "block";
			loginSpinner.style.display = "none";
		}
	}

	// Focus on input
	setTimeout(() => pinInput.focus(), 100);
}

function logout() {
	auth.signOut()
		.then(() => {
			currentUser = null;
			localStorage.removeItem("gameDataAuth");
			localStorage.removeItem("gameDataAuthTime");
			loginScreen();
		})
		.catch((error) => {
			console.error("Logout error:", error);
		});
}

function homeScreen() {
	appDiv.innerHTML = `
		<div class="anime-home-bg" style="min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;background:linear-gradient(135deg, #000 0%, #1a1a1a 50%, #333 100%);padding:20px;position:relative;overflow:hidden;">
			<!-- Background elements -->
			<div class="bg-shapes">
				<div class="shape shape-1"></div>
				<div class="shape shape-2"></div>
				<div class="shape shape-3"></div>
			</div>
			
			<!-- Main card -->
			<div class="home-card" style="background:#fff;border:5px solid #000;border-radius:25px;padding:40px;max-width:450px;width:90%;display:flex;flex-direction:column;align-items:center;position:relative;box-shadow:0 0 0 10px #fff, 0 0 0 15px #000;animation:homeCardFloat 4s ease-in-out infinite;">
				
				<!-- Logout button -->
				<button id="logoutBtn" class="logout-btn" style="position:absolute;top:15px;right:15px;padding:10px 15px;font-size:1rem;background:#000;color:#fff;border:3px solid #000;border-radius:15px;font-weight:800;cursor:pointer;font-family:'Comic Sans MS', cursive;transition:all 0.3s ease;" title="Exit Portal">🚪 EXIT</button>
				
				<!-- Anime mascot -->
				<div class="mascot" style="width:100px;height:100px;background:#000;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:20px;position:relative;animation:mascotDance 3s ease-in-out infinite;">
					<div style="width:70px;height:70px;background:#fff;border-radius:50%;position:relative;">
						<!-- Happy eyes -->
						<div style="position:absolute;top:20px;left:15px;width:8px;height:15px;background:#000;border-radius:50%;transform:rotate(-20deg);"></div>
						<div style="position:absolute;top:20px;right:15px;width:8px;height:15px;background:#000;border-radius:50%;transform:rotate(20deg);"></div>
						<!-- Big smile -->
						<div style="position:absolute;bottom:15px;left:50%;transform:translateX(-50%);width:35px;height:18px;border:3px solid #000;border-top:none;border-radius:0 0 20px 20px;"></div>
					</div>
					<!-- Hat -->
					<div style="position:absolute;top:-15px;width:80px;height:20px;background:#000;border-radius:10px;"></div>
					<div style="position:absolute;top:-25px;left:50%;transform:translateX(-50%);width:40px;height:15px;background:#000;border-radius:8px;"></div>
				</div>
				
				<h1 class="home-title" style="text-align:center;font-size:2.8rem;font-weight:900;color:#000;margin-bottom:10px;font-family:'Comic Sans MS', cursive;text-shadow:4px 4px 0 #fff, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;animation:titleWiggle 2s ease-in-out infinite;line-height:1.2;">GAME DATA PORTAL!</h1>
				
				<p style="text-align:center;color:#333;margin-bottom:35px;font-size:1.2rem;font-weight:600;font-family:'Comic Sans MS', cursive;">Choose your adventure! 🎮</p>
				
				<div class="buttons-container" style="display:flex;flex-direction:column;gap:20px;width:100%;align-items:center;">
					<button id="createUserBtn" class="anime-menu-btn create-btn" style="padding:18px 0;font-size:1.2rem;background:#000;color:#fff;border:4px solid #000;border-radius:20px;font-weight:800;cursor:pointer;width:100%;font-family:'Comic Sans MS', cursive;position:relative;overflow:hidden;transition:all 0.3s ease;">
						<span style="position:relative;z-index:2;">🌟 CREATE NEW USER</span>
						<div class="btn-glow" style="position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);transition:left 0.6s ease;"></div>
					</button>
					
					<button id="listUsersBtn" class="anime-menu-btn list-btn" style="padding:18px 0;font-size:1.2rem;background:#fff;color:#000;border:4px solid #000;border-radius:20px;font-weight:800;cursor:pointer;width:100%;font-family:'Comic Sans MS', cursive;position:relative;overflow:hidden;transition:all 0.3s ease;">
						<span style="position:relative;z-index:2;">📋 USER REGISTRY</span>
						<div class="btn-glow" style="position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent);transition:left 0.6s ease;"></div>
					</button>
				</div>
				
				<!-- Decorative elements -->
				<div class="deco-element" style="position:absolute;top:20px;left:20px;font-size:1.8rem;animation:float 3s ease-in-out infinite;">🎯</div>
				<div class="deco-element" style="position:absolute;bottom:20px;right:20px;font-size:1.5rem;animation:float 3s ease-in-out infinite 1s;">⚡</div>
				<div class="deco-element" style="position:absolute;top:50%;left:10px;font-size:1.3rem;animation:float 3s ease-in-out infinite 0.5s;">🔥</div>
			</div>
		</div>
		
		<style>
			@keyframes homeCardFloat {
				0%, 100% { transform: translateY(0px) scale(1); }
				50% { transform: translateY(-8px) scale(1.02); }
			}
			
			@keyframes mascotDance {
				0%, 100% { transform: translateY(0px) rotate(0deg); }
				25% { transform: translateY(-5px) rotate(-2deg); }
				75% { transform: translateY(-5px) rotate(2deg); }
			}
			
			@keyframes titleWiggle {
				0%, 100% { transform: rotate(0deg); }
				25% { transform: rotate(-1deg); }
				75% { transform: rotate(1deg); }
			}
			
			@keyframes float {
				0%, 100% { transform: translateY(0px) rotate(0deg); }
				50% { transform: translateY(-10px) rotate(180deg); }
			}
			
			@keyframes shapeMove {
				0% { transform: translateX(-100px) rotate(0deg); }
				100% { transform: translateX(calc(100vw + 100px)) rotate(360deg); }
			}
			
			.bg-shapes {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				pointer-events: none;
				overflow: hidden;
			}
			
			.shape {
				position: absolute;
				background: rgba(255,255,255,0.1);
				border: 2px solid rgba(255,255,255,0.2);
			}
			
			.shape-1 {
				width: 50px;
				height: 50px;
				border-radius: 50%;
				top: 20%;
				animation: shapeMove 15s linear infinite;
			}
			
			.shape-2 {
				width: 30px;
				height: 30px;
				top: 60%;
				animation: shapeMove 20s linear infinite 5s;
			}
			
			.shape-3 {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				top: 80%;
				animation: shapeMove 18s linear infinite 10s;
			}
			
			.anime-menu-btn:hover {
				transform: translateY(-5px) scale(1.05);
				box-shadow: 0 10px 20px rgba(0,0,0,0.3);
			}
			
			.create-btn:hover {
				background: #333 !important;
			}
			
			.list-btn:hover {
				background: #f0f0f0 !important;
			}
			
			.anime-menu-btn:hover .btn-glow {
				left: 100%;
			}
			
			.logout-btn:hover {
				background: #333 !important;
				transform: translateY(-2px) rotate(-5deg);
				box-shadow: 0 5px 15px rgba(0,0,0,0.3);
			}
			
			/* Responsive Design */
			@media (max-width: 768px) {
				.home-card {
					padding: 30px 25px !important;
					max-width: 400px !important;
				}
				
				.home-title {
					font-size: 2.2rem !important;
				}
				
				.mascot {
					width: 80px !important;
					height: 80px !important;
				}
				
				.anime-menu-btn {
					padding: 15px 0 !important;
					font-size: 1.1rem !important;
				}
				
				.logout-btn {
					padding: 8px 12px !important;
					font-size: 0.9rem !important;
				}
			}
			
			@media (max-width: 480px) {
				.home-card {
					padding: 25px 20px !important;
				}
				
				.home-title {
					font-size: 1.9rem !important;
				}
				
				.mascot {
					width: 70px !important;
					height: 70px !important;
				}
				
				.deco-element {
					font-size: 1.2rem !important;
				}
			}
		</style>
	`;
	document.getElementById("createUserBtn").onclick = createUserScreen;
	document.getElementById("listUsersBtn").onclick = listUsersScreen;
	document.getElementById("logoutBtn").onclick = logout;
}

function createUserScreen() {
	appDiv.innerHTML = `
		<div class="anime-form-bg" style="min-height:100vh;background:linear-gradient(135deg, #000 0%, #1a1a1a 50%, #333 100%);padding:20px;position:relative;overflow:hidden;">
			<!-- Background decorations -->
			<div class="form-decorations">
				<div class="star-decoration" style="position:absolute;top:10%;left:10%;font-size:2rem;animation:twinkle 2s infinite;">⭐</div>
				<div class="star-decoration" style="position:absolute;top:20%;right:15%;font-size:1.5rem;animation:twinkle 2s infinite 0.5s;">✨</div>
				<div class="star-decoration" style="position:absolute;bottom:20%;left:20%;font-size:1.8rem;animation:twinkle 2s infinite 1s;">🌟</div>
				<div class="star-decoration" style="position:absolute;bottom:10%;right:10%;font-size:1.3rem;animation:twinkle 2s infinite 1.5s;">💫</div>
			</div>
			
			<!-- Main form container -->
			<div class="form-container" style="max-width:600px;margin:0 auto;background:#fff;border:5px solid #000;border-radius:25px;padding:40px;box-shadow:0 0 0 10px #fff, 0 0 0 15px #000;animation:formFloat 4s ease-in-out infinite;">
				
				<!-- Form header -->
				<div class="form-header" style="text-align:center;margin-bottom:30px;">
					<div class="form-mascot" style="width:80px;height:80px;background:#000;border-radius:50%;margin:0 auto 15px;display:flex;align-items:center;justify-content:center;animation:mascotBounce 2s ease-in-out infinite;">
						<div style="width:60px;height:60px;background:#fff;border-radius:50%;position:relative;">
							<div style="position:absolute;top:15px;left:12px;width:8px;height:8px;background:#000;border-radius:50%;"></div>
							<div style="position:absolute;top:15px;right:12px;width:8px;height:8px;background:#000;border-radius:50%;"></div>
							<div style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);width:25px;height:12px;border:2px solid #000;border-top:none;border-radius:0 0 12px 12px;"></div>
						</div>
					</div>
					<h2 style="font-size:2.5rem;font-weight:900;color:#000;margin:0;font-family:'Comic Sans MS', cursive;text-shadow:3px 3px 0 #fff, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">CREATE NEW USER!</h2>
					<p style="color:#333;font-size:1.1rem;font-weight:600;font-family:'Comic Sans MS', cursive;margin:10px 0 0 0;">Build your user profile! 🏆</p>
				</div>
				
				<!-- Username input -->
				<div class="input-group" style="margin-bottom:30px;">
					<label style="display:block;font-size:1.3rem;font-weight:800;color:#000;margin-bottom:10px;font-family:'Comic Sans MS', cursive;">🎭 User Name:</label>
					<input type="text" id="usernameInput" placeholder="Enter username..." maxlength="32" style="width:100%;padding:15px 20px;font-size:1.2rem;border:4px solid #000;border-radius:15px;font-weight:600;background:#f8f8f8;font-family:'Comic Sans MS', cursive;transition:all 0.3s ease;">
				</div>
				
				<!-- Level selection buttons -->
				<div class="level-buttons" style="margin-bottom:30px;">
					<h3 style="font-size:1.5rem;font-weight:800;color:#000;margin-bottom:20px;font-family:'Comic Sans MS', cursive;text-align:center;">⚡ Choose Data Level Type:</h3>
					<div style="display:grid;grid-template-columns:1fr;gap:15px;">
						<button id="eLevelBtn" class="level-btn e-level" style="padding:15px;font-size:1.1rem;background:#fff;color:#000;border:4px solid #000;border-radius:15px;font-weight:800;cursor:pointer;font-family:'Comic Sans MS', cursive;transition:all 0.3s ease;position:relative;overflow:hidden;">
							<span style="position:relative;z-index:2;">📐 E-LEVEL DATA</span>
							<div class="btn-shine" style="position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);transition:left 0.5s ease;"></div>
						</button>
						<button id="colorLevelBtn" class="level-btn color-level" style="padding:15px;font-size:1.1rem;background:#fff;color:#000;border:4px solid #000;border-radius:15px;font-weight:800;cursor:pointer;font-family:'Comic Sans MS', cursive;transition:all 0.3s ease;position:relative;overflow:hidden;">
							<span style="position:relative;z-index:2;">🎨 COLOR DATA</span>
							<div class="btn-shine" style="position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);transition:left 0.5s ease;"></div>
						</button>
						<button id="faceLevelBtn" class="level-btn face-level" style="padding:15px;font-size:1.1rem;background:#fff;color:#000;border:4px solid #000;border-radius:15px;font-weight:800;cursor:pointer;font-family:'Comic Sans MS', cursive;transition:all 0.3s ease;position:relative;overflow:hidden;">
							<span style="position:relative;z-index:2;">👤 FACE DATA</span>
							<div class="btn-shine" style="position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);transition:left 0.5s ease;"></div>
						</button>
					</div>
				</div>
				
				<!-- Back button -->
				<div style="text-align:center;">
					<button id="backBtn" class="back-btn" style="padding:12px 25px;font-size:1.1rem;background:#000;color:#fff;border:4px solid #000;border-radius:15px;font-weight:800;cursor:pointer;font-family:'Comic Sans MS', cursive;transition:all 0.3s ease;">🏠 BACK TO PORTAL</button>
				</div>
				
				<!-- Level form container -->
				<div id="levelForm" style="margin-top:30px;"></div>
			</div>
		</div>
		
		<style>
			@keyframes formFloat {
				0%, 100% { transform: translateY(0px); }
				50% { transform: translateY(-5px); }
			}
			
			@keyframes mascotBounce {
				0%, 100% { transform: translateY(0px) scale(1); }
				50% { transform: translateY(-3px) scale(1.1); }
			}
			
			.level-btn:hover {
				transform: translateY(-3px) scale(1.02);
				box-shadow: 0 8px 15px rgba(0,0,0,0.2);
				background: #f0f0f0 !important;
			}
			
			.level-btn:hover .btn-shine {
				left: 100%;
			}
			
			.back-btn:hover {
				background: #333 !important;
				transform: translateY(-2px);
				box-shadow: 0 5px 10px rgba(0,0,0,0.3);
			}
			
			#usernameInput:focus {
				outline: none;
				border-color: #000;
				background: #fff;
				transform: scale(1.02);
				box-shadow: 0 0 15px rgba(0,0,0,0.2);
			}
			
			/* Responsive Design */
			@media (max-width: 768px) {
				.form-container {
					padding: 30px 25px !important;
					margin: 0 10px !important;
				}
				
				.form-header h2 {
					font-size: 2rem !important;
				}
				
				.level-buttons {
					grid-template-columns: 1fr !important;
				}
				
				.level-btn {
					padding: 12px !important;
					font-size: 1rem !important;
				}
			}
			
			@media (max-width: 480px) {
				.form-container {
					padding: 25px 20px !important;
				}
				
				.form-header h2 {
					font-size: 1.8rem !important;
				}
				
				.form-mascot {
					width: 60px !important;
					height: 60px !important;
				}
			}
		</style>
	`;
	document.getElementById("eLevelBtn").onclick = () => eLevelForm();
	document.getElementById("colorLevelBtn").onclick = () => colorLevelForm();
	document.getElementById("faceLevelBtn").onclick = () => faceLevelForm();
	document.getElementById("backBtn").onclick = homeScreen;
}

function normalizeClickHistory(clicks) {
	// New Firebase records store a `clicks` collection. Depending on how
	// Firebase serializes it, it may come back as either an Array or an
	// object with numeric keys. Older records will not have this field at all.
	if (Array.isArray(clicks)) {
		return clicks.filter((click) => click && typeof click === "object");
	}
	if (clicks && typeof clicks === "object") {
		return Object.keys(clicks)
			.sort((a, b) => {
				const aNum = Number(a);
				const bNum = Number(b);
				if (Number.isFinite(aNum) && Number.isFinite(bNum)) return aNum - bNum;
				return String(a).localeCompare(String(b));
			})
			.map((key) => clicks[key])
			.filter((click) => click && typeof click === "object");
	}
	return [];
}

function forEachIndexedGameItem(collection, callback) {
	// Firebase can deserialize list-like data as arrays or numeric-keyed objects.
	// This helper supports both old and new records without assuming either shape.
	if (!collection || typeof collection !== "object") return;

	if (Array.isArray(collection)) {
		collection.forEach((item, index) => {
			if (item && typeof item === "object") callback(item, index);
		});
		return;
	}

	Object.keys(collection)
		.sort((a, b) => {
			const aNum = Number(a);
			const bNum = Number(b);
			if (Number.isFinite(aNum) && Number.isFinite(bNum)) return aNum - bNum;
			return String(a).localeCompare(String(b));
		})
		.forEach((key, fallbackIndex) => {
			const item = collection[key];
			if (!item || typeof item !== "object") return;
			const numericKey = Number(key);
			callback(item, Number.isFinite(numericKey) ? numericKey : fallbackIndex);
		});
}

function formatGameValue(value, fallback = "-") {
	if (value === undefined || value === null || value === "") return fallback;
	if (typeof value === "number") return Number(value.toFixed(3));
	return value;
}

function renderGameDataBox(gameData) {
	// Legacy Firebase records may have no gameData item at all, or may not
	// contain the newer `clicks` property. Treat those as valid old records.
	if (!gameData || typeof gameData !== "object") return "";

	const hasClickHistoryField = Object.prototype.hasOwnProperty.call(gameData, "clicks");
	const clicks = normalizeClickHistory(gameData.clicks);
	const scoreChange =
		gameData.scoreChange !== undefined
			? gameData.scoreChange
			: gameData.ScoreChange;

	const clickHistoryHtml = clicks.length
		? `<div style="margin-top:10px;">
			<strong>All Clicks:</strong>
			<div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">
				${clicks
					.map((click, index) => {
						const attempt = click.attempt ?? index + 1;
						const clickedItem = click.clickedItem || "unknown";
						const isCorrect = click.isCorrect === true;
						return `<div style="display:grid;grid-template-columns:auto 1fr auto auto;gap:8px;align-items:center;padding:7px 9px;background:${
							isCorrect ? "#eaf8ee" : "#fff0f0"
						};border:1px solid ${isCorrect ? "#a7d8b4" : "#efb0b0"};border-radius:7px;">
							<span><strong>#${attempt}</strong></span>
							<span style="text-transform:capitalize;">${clickedItem}</span>
							<span>Distance: <strong>${formatGameValue(click.distance)}</strong></span>
							<span style="font-weight:700;">${isCorrect ? "✓ Correct" : "✗ Incorrect"}</span>
						</div>`;
					})
					.join("")}
			</div>
		</div>`
		: hasClickHistoryField
			? `<div style="margin-top:8px;color:#666;font-size:0.9rem;">No per-click history was recorded for this result.</div>`
			: `<div style="margin-top:8px;color:#666;font-size:0.9rem;">Per-click history is not available for this older result.</div>`;

	return `<div class='gamedata-box' style='margin-top:6px;padding:10px;background:#f6f6f6;border-radius:6px;'>
		<strong>Game Data:</strong><br>
		Score Change: ${formatGameValue(scoreChange)}<br>
		Attempts: ${formatGameValue(gameData.attempts)}<br>
		Correct Answer Distance: ${formatGameValue(gameData.distance)}
		${clickHistoryHtml}
	</div>`;
}

function eLevelForm(userId = null, existingData = null) {
	const levelForm = document.getElementById("levelForm");
	let countValue = existingData ? existingData.length : 0;
	levelForm.innerHTML = `
	<div class="level-section">
	  <h3>E Level</h3>
	  <label>Number of Items: <input type="number" id="eLevelCount" min="0" max="100" value="${countValue}"></label>
	  <form id="eLevelItems"></form>
	  <button id="saveELevelBtn" style="display:none;">Save</button>
	</div>
  `;
	function generateItems() {
		const count = parseInt(document.getElementById("eLevelCount").value);
		const itemsForm = document.getElementById("eLevelItems");
		itemsForm.innerHTML = "";
		// Try to get gameData from userData if available
		let gameData = null;
		if (
			userId &&
			window.currentUserData &&
			window.currentUserData.gameData &&
			window.currentUserData.gameData.e
		) {
			gameData = window.currentUserData.gameData.e;
		}
		for (let i = 0; i < count; i++) {
			const val =
				existingData && existingData[i] !== undefined
					? existingData[i]
					: "";
			let gameDataHtml = "";
			if (gameData && gameData[i]) {
				gameDataHtml = renderGameDataBox(gameData[i]);
			}
			itemsForm.innerHTML += `
				<div style="background: linear-gradient(90deg, #e3f0ff 0%, #f9f9f9 100%); border: 1px solid #b3c6e0; border-radius: 10px; margin-bottom: 14px; padding: 14px; box-shadow: 0 2px 8px rgba(180,200,230,0.08);">
					<label style="font-weight:600;">Item ${
						i + 1
					}: <input type="number" name="item${i}" value="${val}" required style="margin-left:8px;"> <span>cm</span></label>
					${gameDataHtml}
				</div>
			`;
		}
		document.getElementById("saveELevelBtn").style.display =
			count > 0 ? "inline" : "none";
	}
	document
		.getElementById("eLevelCount")
		.addEventListener("input", generateItems);
	generateItems();
	document.getElementById("saveELevelBtn").onclick = async (e) => {
		e.preventDefault();
		const count = parseInt(document.getElementById("eLevelCount").value);
		const items = [];
		for (let i = 0; i < count; i++) {
			items.push(
				Number(document.querySelector(`[name="item${i}"]`).value)
			);
		}
		try {
			console.log("Current user:", currentUser);
			console.log("Auth state:", auth.currentUser);

			if (userId) {
				console.log("Updating existing user:", userId);
				await db.ref(`users/${userId}/eLevel`).set(items);
				await db
					.ref(`users/${userId}/updatedAt`)
					.set(new Date().toISOString());
				alert("E Level data updated!");
				editUserScreen(userId, {
					...(await db.ref(`users/${userId}`).get()).val(),
				});
			} else {
				const username = document
					.getElementById("usernameInput")
					.value.trim();
				if (!username) {
					alert("Please enter a username.");
					return;
				}
				const now = new Date().toISOString();
				const userRef = db.ref("users").push();
				console.log("Creating new user with data:", {
					username,
					createdAt: now,
					updatedAt: now,
					eLevel: items,
				});
				await userRef.set({
					username,
					createdAt: now,
					updatedAt: now,
					eLevel: items,
				});
				alert("E Level data saved!");
				homeScreen();
			}
		} catch (error) {
			console.error("Database write error:", error);
			console.error("Error code:", error.code);
			console.error("Error message:", error.message);
			alert(`Failed to save data: ${error.message}`);
		}
	};
}

function colorLevelForm(userId = null, existingData = null) {
	const levelForm = document.getElementById("levelForm");
	let countValue = existingData ? existingData.length : 0;
	levelForm.innerHTML = `
	<div class="level-section">
	  <h3>Color Level</h3>
	  <label>Number of Items: <input type="number" id="colorLevelCount" min="0" max="100" value="${countValue}"></label>
	  <form id="colorLevelItems"></form>
	  <button id="saveColorLevelBtn" style="display:none;">Save</button>
	</div>
  `;
	function generateItems() {
		const count = parseInt(
			document.getElementById("colorLevelCount").value
		);
		const itemsForm = document.getElementById("colorLevelItems");
		itemsForm.innerHTML = "";
		// Try to get gameData from userData if available
		let gameData = null;
		if (
			userId &&
			window.currentUserData &&
			window.currentUserData.gameData &&
			window.currentUserData.gameData.color
		) {
			gameData = window.currentUserData.gameData.color;
		}
		for (let i = 0; i < count; i++) {
			let gameDataHtml = "";
			if (gameData && gameData[i]) {
				gameDataHtml = renderGameDataBox(gameData[i]);
			}
			itemsForm.innerHTML += `
				<div style="background: linear-gradient(90deg, #fffbe3 0%, #f9f9f9 100%); border: 1px solid #e0d6b3; border-radius: 10px; margin-bottom: 14px; padding: 14px; box-shadow: 0 2px 8px rgba(230,220,180,0.08);">
					<label style="font-weight:600;">Item ${i + 1}:</label>
					<div style="display:flex;gap:10px;">
						${[0, 1, 2]
							.map((j) => {
								const val =
									existingData &&
									existingData[i] &&
									existingData[i][j]
										? existingData[i][j]
										: "";
								return `
							<div style="display:flex;flex-direction:column;align-items:center;">
								<div class="color-square" id="colorPreview${i}_${j}" style="background:${val}"></div>
								<input type="text" name="color${i}_${j}" value="${val}" placeholder="#RRGGBB" maxlength="7" autocomplete="off">
							</div>
						`;
							})
							.join("")}
					</div>
					${gameDataHtml}
				</div>
			`;
		}
		// Add color preview listeners
		for (let i = 0; i < count; i++) {
			for (let j = 0; j < 3; j++) {
				const input = document.querySelector(`[name="color${i}_${j}"]`);
				input.addEventListener("input", () => {
					document.getElementById(
						`colorPreview${i}_${j}`
					).style.background = input.value;
				});
			}
		}
		document.getElementById("saveColorLevelBtn").style.display =
			count > 0 ? "inline" : "none";
	}
	document
		.getElementById("colorLevelCount")
		.addEventListener("input", generateItems);
	generateItems();
	document.getElementById("saveColorLevelBtn").onclick = async (e) => {
		e.preventDefault();
		const count = parseInt(
			document.getElementById("colorLevelCount").value
		);
		const items = [];
		for (let i = 0; i < count; i++) {
			const colors = [];
			for (let j = 0; j < 3; j++) {
				colors.push(
					document.querySelector(`[name="color${i}_${j}"]`).value
				);
			}
			items.push(colors);
		}
		if (userId) {
			await db.ref(`users/${userId}/colorLevel`).set(items);
			await db
				.ref(`users/${userId}/updatedAt`)
				.set(new Date().toISOString());
			alert("Color Level data updated!");
			editUserScreen(userId, {
				...(await db.ref(`users/${userId}`).get()).val(),
			});
		} else {
			const username = document
				.getElementById("usernameInput")
				.value.trim();
			if (!username) {
				alert("Please enter a username.");
				return;
			}
			const now = new Date().toISOString();
			const userRef = db.ref("users").push();
			await userRef.set({
				username,
				createdAt: now,
				updatedAt: now,
				colorLevel: items,
			});
			alert("Color Level data saved!");
			homeScreen();
		}
	};
}

function faceLevelForm(userId = null, existingData = null) {
	const levelForm = document.getElementById("levelForm");
	let countValue = existingData ? existingData.length : 0;
	levelForm.innerHTML = `
	<div class="level-section">
	  <h3>Face Level</h3>
	  <label>Number of Items: <input type="number" id="faceLevelCount" min="0" max="20" value="${countValue}"></label>
	  <form id="faceLevelItems"></form>
	  <button id="saveFaceLevelBtn" style="display:none;">Save</button>
	</div>
  `;
	function generateItems() {
		const count = parseInt(document.getElementById("faceLevelCount").value);
		const itemsForm = document.getElementById("faceLevelItems");
		itemsForm.innerHTML = "";
		// Try to get gameData from userData if available
		let gameData = null;
		if (
			userId &&
			window.currentUserData &&
			window.currentUserData.gameData &&
			window.currentUserData.gameData.face
		) {
			gameData = window.currentUserData.gameData.face;
		}
		for (let i = 0; i < count; i++) {
			let gameDataHtml = "";
			if (gameData && gameData[i]) {
				gameDataHtml = renderGameDataBox(gameData[i]);
			}
			itemsForm.innerHTML += `
				<div style="background: linear-gradient(90deg, #fbe3ff 0%, #f9f9f9 100%); border: 1px solid #e0b3d6; border-radius: 10px; margin-bottom: 14px; padding: 14px; box-shadow: 0 2px 8px rgba(230,180,220,0.08);">
					<label style="font-weight:600;">Item ${i + 1}:</label>
					<div style="display:flex;gap:10px;flex-wrap:wrap;padding:8px 0;">
						${[0, 1, 2]
							.map((j) => {
								let imgUrl =
									existingData &&
									existingData[i] &&
									existingData[i][j]
										? existingData[i][j]
										: "";
								return `
							<div style="display:flex;flex-direction:column;align-items:center;min-width:120px;max-width:150px;">
								<div class="img-square" id="imgPreview${i}_${j}" style="background-image:${
									imgUrl ? `url('${imgUrl}')` : "none"
								};width:80px;height:80px;border-radius:8px;border:1px solid #ccc;background-size:cover;background-position:center;margin-bottom:8px;"></div>
								<input type="file" accept="image/*" name="face${i}_${j}" style="width:100%;">
							</div>
						`;
							})
							.join("")}
					</div>
					${gameDataHtml}
				</div>
			`;
		}
		// Add image preview listeners
		for (let i = 0; i < count; i++) {
			for (let j = 0; j < 3; j++) {
				const input = document.querySelector(`[name="face${i}_${j}"]`);
				input.addEventListener("change", (e) => {
					const file = e.target.files[0];
					if (file) {
						const reader = new FileReader();
						reader.onload = (ev) => {
							document.getElementById(
								`imgPreview${i}_${j}`
							).style.backgroundImage = `url('${ev.target.result}')`;
						};
						reader.readAsDataURL(file);
					}
				});
			}
		}
		document.getElementById("saveFaceLevelBtn").style.display =
			count > 0 ? "inline" : "none";
	}
	document
		.getElementById("faceLevelCount")
		.addEventListener("input", generateItems);
	generateItems();
	document.getElementById("saveFaceLevelBtn").onclick = async (e) => {
		e.preventDefault();
		const count = parseInt(document.getElementById("faceLevelCount").value);
		const items = [];
		for (let i = 0; i < count; i++) {
			const faces = [];
			for (let j = 0; j < 3; j++) {
				const input = document.querySelector(`[name="face${i}_${j}"]`);
				const file = input.files[0];
				if (file) {
					// Upload to Cloudinary
					const data = await uploadImage(file);
					if (data.secure_url) {
						faces.push(data.secure_url);
					} else {
						faces.push("");
					}
				} else if (
					existingData &&
					existingData[i] &&
					existingData[i][j]
				) {
					faces.push(existingData[i][j]);
				} else {
					faces.push("");
				}
			}
			items.push(faces);
		}
		if (userId) {
			await db.ref(`users/${userId}/faceLevel`).set(items);
			await db
				.ref(`users/${userId}/updatedAt`)
				.set(new Date().toISOString());
			alert("Face Level data updated!");
			editUserScreen(userId, {
				...(await db.ref(`users/${userId}`).get()).val(),
			});
		} else {
			const username = document
				.getElementById("usernameInput")
				.value.trim();
			if (!username) {
				alert("Please enter a username.");
				return;
			}
			const now = new Date().toISOString();
			const userRef = db.ref("users").push();
			await userRef.set({
				username,
				createdAt: now,
				updatedAt: now,
				faceLevel: items,
			});
			alert("Face Level data saved!");
			homeScreen();
		}
	};
}

function editUserScreen(userId, userData = {}) {
	// Store userData globally for gameData access in forms
	window.currentUserData = userData;
	appDiv.innerHTML = `
		<h2>Edit User: ${userData.username ? userData.username : userId}</h2>
		<button id="eLevelBtn">E Level</button>
		<button id="colorLevelBtn">Color Level</button>
		<button id="faceLevelBtn">Face Level</button>
		<button id="backBtn">Back</button>
		<div id="levelForm"></div>
	`;
	document.getElementById("eLevelBtn").onclick = () =>
		eLevelForm(userId, userData.eLevel);
	document.getElementById("colorLevelBtn").onclick = () =>
		colorLevelForm(userId, userData.colorLevel);
	document.getElementById("faceLevelBtn").onclick = () =>
		faceLevelForm(userId, userData.faceLevel);
	document.getElementById("backBtn").onclick = listUsersScreen;
}

async function listUsersScreen() {
	appDiv.innerHTML = `
		<div class="anime-list-bg" style="min-height:100vh;background:linear-gradient(135deg, #000 0%, #1a1a1a 50%, #333 100%);padding:20px;position:relative;">
			<div class="list-container" style="max-width:800px;margin:0 auto;background:#fff;border:5px solid #000;border-radius:25px;padding:30px;box-shadow:0 0 0 10px #fff, 0 0 0 15px #000;">
				
				<!-- Header -->
				<div class="list-header" style="text-align:center;margin-bottom:30px;">
					<div class="list-mascot" style="width:80px;height:80px;background:#000;border-radius:50%;margin:0 auto 15px;display:flex;align-items:center;justify-content:center;animation:bounce 2s ease-in-out infinite;">
						<div style="width:60px;height:60px;background:#fff;border-radius:50%;position:relative;">
							<div style="position:absolute;top:15px;left:12px;width:8px;height:8px;background:#000;border-radius:50%;"></div>
							<div style="position:absolute;top:15px;right:12px;width:8px;height:8px;background:#000;border-radius:50%;"></div>
							<div style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);width:25px;height:12px;border:2px solid #000;border-top:none;border-radius:0 0 12px 12px;"></div>
						</div>
					</div>
					<h2 style="font-size:2.5rem;font-weight:900;color:#000;margin:0;font-family:'Comic Sans MS', cursive;text-shadow:3px 3px 0 #fff, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">📋 USER REGISTRY</h2>
					<p style="color:#333;font-size:1.1rem;font-weight:600;font-family:'Comic Sans MS', cursive;margin:10px 0 0 0;">Manage all your users! 👥</p>
				</div>
				
				<ul id="usersList" style="list-style:none;padding:0;margin:0 0 30px 0;"></ul>
				
				<div style="text-align:center;">
					<button id="backBtn" class="back-btn" style="padding:12px 25px;font-size:1.1rem;background:#000;color:#fff;border:4px solid #000;border-radius:15px;font-weight:800;cursor:pointer;font-family:'Comic Sans MS', cursive;transition:all 0.3s ease;">🏠 BACK TO PORTAL</button>
				</div>
			</div>
		</div>
		
		<style>
			.exportBtn:hover, .deleteBtn:hover {
				transform: translateY(-2px) scale(1.05);
				box-shadow: 0 5px 10px rgba(0,0,0,0.3);
			}
			
			.deleteBtn:hover {
				background: #f0f0f0 !important;
			}
			
			.back-btn:hover {
				background: #333 !important;
				transform: translateY(-2px);
				box-shadow: 0 5px 10px rgba(0,0,0,0.3);
			}
			
			/* Responsive design for user list */
			@media (max-width: 768px) {
				.list-container {
					padding: 25px 20px !important;
					margin: 0 10px !important;
				}
				
				.list-header h2 {
					font-size: 2rem !important;
				}
				
				ul#usersList li {
					padding: 15px !important;
				}
				
				.exportBtn, .deleteBtn {
					padding: 6px 10px !important;
					font-size: 0.8rem !important;
				}
			}
			
			@media (max-width: 480px) {
				.list-header h2 {
					font-size: 1.8rem !important;
				}
				
				ul#usersList li div[style*="grid-template-columns"] {
					grid-template-columns: 1fr !important;
					gap: 8px !important;
				}
			}
		</style>
	`;
	document.getElementById("backBtn").onclick = homeScreen;
	const usersList = document.getElementById("usersList");
	const snapshot = await db.ref("users").once("value");
	if (snapshot.exists()) {
		const users = snapshot.val();
		// Add SheetJS CDN if not present
		if (!document.getElementById("sheetjs-cdn")) {
			const script = document.createElement("script");
			script.id = "sheetjs-cdn";
			script.src =
				"https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js";
			document.head.appendChild(script);
		}
		Object.entries(users).forEach(([key, value]) => {
			const li = document.createElement("li");
			const username = value.username || key;
			const createdAt = value.createdAt
				? new Date(value.createdAt).toLocaleString()
				: "-";
			const updatedAt = value.updatedAt
				? new Date(value.updatedAt).toLocaleString()
				: createdAt;
			li.style.position = "relative";
			li.style.background = "#fff";
			li.style.borderRadius = "12px";
			li.style.boxShadow = "0 2px 8px rgba(49,130,206,0.08)";
			li.style.padding = "18px 18px 14px 18px";
			li.style.marginBottom = "18px";
			// Check if user has any data (level data or game data)
			const hasData =
				(value.eLevel &&
					Array.isArray(value.eLevel) &&
					value.eLevel.length > 0) ||
				(value.colorLevel &&
					Array.isArray(value.colorLevel) &&
					value.colorLevel.length > 0) ||
				(value.faceLevel &&
					Array.isArray(value.faceLevel) &&
					value.faceLevel.length > 0) ||
				(value.gameData && Object.keys(value.gameData).length > 0);

			li.innerHTML = `
				<div style="position:absolute;top:15px;right:15px;display:flex;gap:10px;">
					<button class="exportBtn" style="padding:8px 12px;background:#000;color:#fff;border:3px solid #000;border-radius:15px;font-weight:800;cursor:pointer;font-family:'Comic Sans MS', cursive;transition:all 0.3s ease;font-size:0.9rem;" title="Export Complete User Data">
						📊 EXPORT
					</button>
					<button class="deleteBtn" style="padding:8px 12px;background:#fff;color:#000;border:3px solid #000;border-radius:15px;font-weight:800;cursor:pointer;font-family:'Comic Sans MS', cursive;transition:all 0.3s ease;font-size:0.9rem;" title="Delete User">
						🗑️ DELETE
					</button>
				</div>
				
				<div style="margin-bottom:15px;">
					<span style="cursor:pointer;color:#000;font-size:1.3rem;font-weight:800;font-family:'Comic Sans MS', cursive;text-decoration:underline;">👤 ${username}</span>
				</div>
				
				<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;font-family:'Comic Sans MS', cursive;">
					<div style="background:#f8f8f8;padding:8px;border-radius:8px;border:2px solid #000;">
						<strong>📅 Created:</strong><br>
						<small>${createdAt}</small>
					</div>
					<div style="background:#f8f8f8;padding:8px;border-radius:8px;border:2px solid #000;">
						<strong>🔄 Updated:</strong><br>
						<small>${updatedAt}</small>
					</div>
				</div>
				
				<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-family:'Comic Sans MS', cursive;font-size:0.9rem;">
					<div style="text-align:center;padding:6px;border-radius:8px;border:2px solid #000;${
						value.eLevel && value.eLevel.length > 0
							? "background:#e8f5e8;"
							: "background:#fff5f5;"
					}">
						<div style="font-size:1.2rem;">${
							value.eLevel && value.eLevel.length > 0
								? "✅"
								: "❌"
						}</div>
						<div style="font-weight:700;">E-Level</div>
						<div style="font-size:0.8rem;">${
							value.eLevel ? value.eLevel.length : 0
						} items</div>
					</div>
					<div style="text-align:center;padding:6px;border-radius:8px;border:2px solid #000;${
						value.colorLevel && value.colorLevel.length > 0
							? "background:#e8f5e8;"
							: "background:#fff5f5;"
					}">
						<div style="font-size:1.2rem;">${
							value.colorLevel && value.colorLevel.length > 0
								? "✅"
								: "❌"
						}</div>
						<div style="font-weight:700;">Color</div>
						<div style="font-size:0.8rem;">${
							value.colorLevel ? value.colorLevel.length : 0
						} items</div>
					</div>
					<div style="text-align:center;padding:6px;border-radius:8px;border:2px solid #000;${
						value.faceLevel && value.faceLevel.length > 0
							? "background:#e8f5e8;"
							: "background:#fff5f5;"
					}">
						<div style="font-size:1.2rem;">${
							value.faceLevel && value.faceLevel.length > 0
								? "✅"
								: "❌"
						}</div>
						<div style="font-weight:700;">Face</div>
						<div style="font-size:0.8rem;">${
							value.faceLevel ? value.faceLevel.length : 0
						} items</div>
					</div>
				</div>
				
				${
					value.gameData
						? `
					<div style="margin-top:10px;padding:8px;background:#e6fffa;border-radius:8px;border:2px solid #000;font-family:'Comic Sans MS', cursive;">
						<strong style="color:#000;">🎮 Game Data Available:</strong><br>
						<div style="font-size:0.9rem;margin-top:5px;">
							${value.gameData.e ? "🎯 E-Level performance data<br>" : ""}
							${value.gameData.color ? "🎨 Color-Level performance data<br>" : ""}
							${value.gameData.face ? "👤 Face-Level performance data<br>" : ""}
						</div>
					</div>
				`
						: ""
				}
			`;
			li.querySelector("span").onclick = () => editUserScreen(key, value);
			li.querySelector(".exportBtn").onclick = () =>
				exportUserGameData(username, value);
			li.querySelector(".deleteBtn").onclick = () => {
				if (
					confirm(
						`Are you sure you want to delete user '${username}'? This action cannot be undone.`
					)
				) {
					db.ref(`users/${key}`)
						.remove()
						.then(() => {
							alert("User deleted successfully.");
							listUsersScreen();
						});
				}
			};
			usersList.appendChild(li);
		});
		// Export complete user data to Excel with nice formatting
		function exportUserGameData(username, userData) {
			if (!window.XLSX) {
				alert(
					"Excel export library not loaded yet. Please wait a moment and try again."
				);
				return;
			}

			const wb = window.XLSX.utils.book_new();

			// 1. User Information Sheet
			const userInfo = [
				{
					Field: "Username",
					Value: userData.username || "N/A",
				},
				{
					Field: "Created Date",
					Value: userData.createdAt
						? new Date(userData.createdAt).toLocaleString()
						: "N/A",
				},
				{
					Field: "Last Updated",
					Value: userData.updatedAt
						? new Date(userData.updatedAt).toLocaleString()
						: "N/A",
				},
				{
					Field: "Has E-Level Data",
					Value:
						userData.eLevel &&
						Array.isArray(userData.eLevel) &&
						userData.eLevel.length > 0
							? "Yes"
							: "No",
				},
				{
					Field: "Has Color-Level Data",
					Value:
						userData.colorLevel &&
						Array.isArray(userData.colorLevel) &&
						userData.colorLevel.length > 0
							? "Yes"
							: "No",
				},
				{
					Field: "Has Face-Level Data",
					Value:
						userData.faceLevel &&
						Array.isArray(userData.faceLevel) &&
						userData.faceLevel.length > 0
							? "Yes"
							: "No",
				},
				{
					Field: "Has Game Data",
					Value: userData.gameData ? "Yes" : "No",
				},
			];

			const userInfoWS = window.XLSX.utils.json_to_sheet(userInfo);
			// Set column widths
			userInfoWS["!cols"] = [
				{ wch: 20 }, // Field column
				{ wch: 30 }, // Value column
			];
			window.XLSX.utils.book_append_sheet(
				wb,
				userInfoWS,
				"User Information"
			);

			// 2. E-Level Data Sheet
			if (
				userData.eLevel &&
				Array.isArray(userData.eLevel) &&
				userData.eLevel.length > 0
			) {
				const eLevelData = userData.eLevel.map((value, idx) => {
					const gameData = userData.gameData?.e?.[idx] || {};
					return {
						"Item Number": idx + 1,
						"E-Level Value (cm)": value,
						"Game Score Change":
							gameData.scoreChange ??
							gameData.ScoreChange ??
							"N/A",
						"Game Attempts": gameData.attempts ?? "N/A",
						"Game Distance": gameData.distance ?? "N/A",
					};
				});

				const eLevelWS = window.XLSX.utils.json_to_sheet(eLevelData);
				eLevelWS["!cols"] = [
					{ wch: 12 }, // Item Number
					{ wch: 18 }, // E-Level Value
					{ wch: 18 }, // Score Change
					{ wch: 15 }, // Attempts
					{ wch: 15 }, // Distance
				];
				window.XLSX.utils.book_append_sheet(
					wb,
					eLevelWS,
					"E-Level Data"
				);
			}

			// 3. Color-Level Data Sheet
			if (
				userData.colorLevel &&
				Array.isArray(userData.colorLevel) &&
				userData.colorLevel.length > 0
			) {
				const colorLevelData = userData.colorLevel.map(
					(colors, idx) => {
						const gameData = userData.gameData?.color?.[idx] || {};
						return {
							"Item Number": idx + 1,
							"Color 1": Array.isArray(colors)
								? colors[0] || "N/A"
								: "N/A",
							"Color 2": Array.isArray(colors)
								? colors[1] || "N/A"
								: "N/A",
							"Color 3": Array.isArray(colors)
								? colors[2] || "N/A"
								: "N/A",
							"Game Score Change": gameData.scoreChange ?? "N/A",
							"Game Attempts": gameData.attempts ?? "N/A",
							"Game Distance": gameData.distance ?? "N/A",
						};
					}
				);

				const colorLevelWS =
					window.XLSX.utils.json_to_sheet(colorLevelData);
				colorLevelWS["!cols"] = [
					{ wch: 12 }, // Item Number
					{ wch: 15 }, // Color 1
					{ wch: 15 }, // Color 2
					{ wch: 15 }, // Color 3
					{ wch: 18 }, // Score Change
					{ wch: 15 }, // Attempts
					{ wch: 15 }, // Distance
				];
				window.XLSX.utils.book_append_sheet(
					wb,
					colorLevelWS,
					"Color-Level Data"
				);
			}

			// 4. Face-Level Data Sheet
			if (
				userData.faceLevel &&
				Array.isArray(userData.faceLevel) &&
				userData.faceLevel.length > 0
			) {
				const faceLevelData = userData.faceLevel.map((faces, idx) => {
					const gameData = userData.gameData?.face?.[idx] || {};
					return {
						"Item Number": idx + 1,
						"Face Image 1 URL": Array.isArray(faces)
							? faces[0] || "N/A"
							: "N/A",
						"Face Image 2 URL": Array.isArray(faces)
							? faces[1] || "N/A"
							: "N/A",
						"Face Image 3 URL": Array.isArray(faces)
							? faces[2] || "N/A"
							: "N/A",
						"Game Score Change": gameData.scoreChange ?? "N/A",
						"Game Attempts": gameData.attempts ?? "N/A",
						"Game Distance": gameData.distance ?? "N/A",
					};
				});

				const faceLevelWS =
					window.XLSX.utils.json_to_sheet(faceLevelData);
				faceLevelWS["!cols"] = [
					{ wch: 12 }, // Item Number
					{ wch: 25 }, // Face Image 1 URL
					{ wch: 25 }, // Face Image 2 URL
					{ wch: 25 }, // Face Image 3 URL
					{ wch: 18 }, // Score Change
					{ wch: 15 }, // Attempts
					{ wch: 15 }, // Distance
				];
				window.XLSX.utils.book_append_sheet(
					wb,
					faceLevelWS,
					"Face-Level Data"
				);
			}

			// 5. Complete Game Data Sheet (if exists)
			if (userData.gameData) {
				const allGameData = [];

				// Add game data. Support both Firebase arrays and numeric-keyed objects
				// so exports also remain compatible with existing/legacy records.
				[
					["E-Level", userData.gameData.e],
					["Color-Level", userData.gameData.color],
					["Face-Level", userData.gameData.face],
				].forEach(([levelName, levelItems]) => {
					forEachIndexedGameItem(levelItems, (item, idx) => {
						allGameData.push({
							"Level Type": levelName,
							"Item Number": idx + 1,
							"Score Change": item.scoreChange ?? item.ScoreChange ?? "N/A",
							Attempts: item.attempts ?? "N/A",
							Distance: item.distance ?? "N/A",
							"Additional Data": JSON.stringify(item),
						});
					});
				});

				if (allGameData.length > 0) {
					const gameDataWS =
						window.XLSX.utils.json_to_sheet(allGameData);
					gameDataWS["!cols"] = [
						{ wch: 15 }, // Level Type
						{ wch: 12 }, // Item Number
						{ wch: 15 }, // Score Change
						{ wch: 12 }, // Attempts
						{ wch: 12 }, // Distance
						{ wch: 30 }, // Additional Data
					];
					window.XLSX.utils.book_append_sheet(
						wb,
						gameDataWS,
						"All Game Data"
					);
				}
			}

			// 6. Per-click History Sheet
			if (userData.gameData) {
				const clickHistoryData = [];
				const levelDefinitions = [
					["E-Level", userData.gameData.e],
					["Color-Level", userData.gameData.color],
					["Face-Level", userData.gameData.face],
				];

				levelDefinitions.forEach(([levelName, levelItems]) => {
					forEachIndexedGameItem(levelItems, (item, itemIdx) => {
						normalizeClickHistory(item.clicks).forEach((click, clickIdx) => {
							clickHistoryData.push({
								"Level Type": levelName,
								"Item Number": itemIdx + 1,
								"Attempt Number": click.attempt ?? clickIdx + 1,
								"Clicked Item": click.clickedItem || "N/A",
								Distance: click.distance ?? "N/A",
								Correct:
									click.isCorrect === true
										? "Yes"
										: click.isCorrect === false
											? "No"
											: "N/A",
							});
						});
					});
				});

				if (clickHistoryData.length > 0) {
					const clickHistoryWS = window.XLSX.utils.json_to_sheet(clickHistoryData);
					clickHistoryWS["!cols"] = [
						{ wch: 15 },
						{ wch: 12 },
						{ wch: 15 },
						{ wch: 15 },
						{ wch: 14 },
						{ wch: 10 },
					];
					window.XLSX.utils.book_append_sheet(
						wb,
						clickHistoryWS,
						"Click History"
					);
				}
			}

			// 7. Summary Sheet
			const summary = [
				{
					"Export Information": "User Data Export",
					Username: userData.username || "N/A",
					"Export Date": new Date().toLocaleString(),
					"Total E-Level Items": userData.eLevel
						? userData.eLevel.length
						: 0,
					"Total Color-Level Items": userData.colorLevel
						? userData.colorLevel.length
						: 0,
					"Total Face-Level Items": userData.faceLevel
						? userData.faceLevel.length
						: 0,
					"Game Data Available": userData.gameData ? "Yes" : "No",
				},
			];

			const summaryWS = window.XLSX.utils.json_to_sheet(summary);
			summaryWS["!cols"] = [
				{ wch: 20 }, // Export Information
				{ wch: 15 }, // Username
				{ wch: 20 }, // Export Date
				{ wch: 18 }, // Total E-Level Items
				{ wch: 20 }, // Total Color-Level Items
				{ wch: 18 }, // Total Face-Level Items
				{ wch: 18 }, // Game Data Available
			];
			window.XLSX.utils.book_append_sheet(wb, summaryWS, "Summary");

			// Download with formatted filename
			const timestamp = new Date().toISOString().split("T")[0];
			const fileName = `${username.replace(
				/\s+/g,
				"_"
			)}_CompleteData_${timestamp}.xlsx`;
			window.XLSX.writeFile(wb, fileName);

			// Show success message
			alert(
				`📊 Excel file downloaded successfully!\nFilename: ${fileName}\n\nIncludes:\n✅ User Information\n✅ E-Level Data\n✅ Color-Level Data\n✅ Face-Level Data\n✅ Game Performance Data\n✅ Per-Click History\n✅ Summary Report`
			);
		}
	} else {
		usersList.innerHTML = "<li>No users found.</li>";
	}
}

// Replace with your Cloudinary cloud name and unsigned upload preset
const cloudName = "dpys2kkvc";
const uploadPreset = "prakash";

function uploadImage(file) {
	const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", uploadPreset);

	return fetch(url, {
		method: "POST",
		body: formData,
	}).then((response) => response.json());
}

// Authentication check and app initialization
function checkAuthAndInitialize() {
	// Check if user is already authenticated
	const authStatus = localStorage.getItem("gameDataAuth");
	const authTime = localStorage.getItem("gameDataAuthTime");

	// Check if localStorage auth is still valid (24 hours)
	const isLocalStorageValid =
		authStatus === "authenticated" &&
		authTime &&
		Date.now() - parseInt(authTime) < 24 * 60 * 60 * 1000;

	// Listen for Firebase auth state changes
	auth.onAuthStateChanged((user) => {
		console.log("Auth state changed:", user ? user.uid : "No user");
		console.log("Local storage valid:", isLocalStorageValid);

		if (user && isLocalStorageValid) {
			// User is authenticated
			console.log("User authenticated, showing home screen");
			currentUser = user;
			homeScreen();
		} else {
			// User is not authenticated or session expired
			console.log("User not authenticated or session expired");
			currentUser = null;
			localStorage.removeItem("gameDataAuth");
			localStorage.removeItem("gameDataAuthTime");
			loginScreen();
		}
	});
}

// Show loading screen initially
appDiv.innerHTML = `
	<div style="min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;background:linear-gradient(120deg,#e3f0ff 0%,#cce0ff 100%);padding:0;">
		<div style="background:#fff;box-shadow:0 4px 24px rgba(49,130,206,0.08);border-radius:18px;padding:40px 32px;max-width:350px;width:90vw;display:flex;flex-direction:column;align-items:center;">
			<h2 style="color:#2a4365;margin-bottom:24px;">Loading...</h2>
			<div style="width:40px;height:40px;border:4px solid #e2e8f0;border-top:4px solid #3182ce;border-radius:50%;animation:spin 1s linear infinite;"></div>
		</div>
	</div>
`;

// Initialize the app
checkAuthAndInitialize();
