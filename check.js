(function() {
    /* --- 1. CONFIG & SYSTEM SETTINGS --- */
    const projectID = "reactions-maker-site"; 
    const dbURL = `https://${projectID}-default-rtdb.firebaseio.com/users.json`;

    // 20-Digit Unique ID for Local Storage
    let myUID = localStorage.getItem('ahmad_script_uid');
    if (!myUID) {
        myUID = ""; 
        for (let i = 0; i < 20; i++) myUID += Math.floor(Math.random() * 10);
        localStorage.setItem('ahmad_script_uid', myUID);
    }

    // CSS for Lock Screen & UI
    var lockStyle = document.createElement('style');
    lockStyle.innerHTML = `
        .ahmad-lock-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:#0e121a; z-index:99999; display:flex; justify-content:center; align-items:center; font-family:sans-serif; }
        .ahmad-white-box { background:#fff; padding:30px; border-radius:20px; text-align:center; width:310px; box-shadow:0 10px 40px rgba(0,0,0,0.5); border: 1px solid #eee; }
        .ahmad-id-box { color:#000; margin:15px 0; font-family:monospace; font-weight:bold; font-size:15px; background:#f1f5f9; padding:12px; border-radius:8px; border:1px dashed #0088cc; }
        .ahmad-lock-title { font-size:35px; font-weight:900; color:#ef4444; margin:10px 0; }
        dialog::backdrop { background: rgba(0,0,0,0.85); }
    `;
    document.head.appendChild(lockStyle);

    var overlay = document.createElement('div');
    overlay.className = 'ahmad-lock-overlay';
    overlay.innerHTML = '<div style="color:white; font-size:18px;">INITIALIZING SYSTEM...</div>';
    document.body.appendChild(overlay);

    /* --- 2. VERIFICATION & IMAGE PRELOADING --- */
    fetch(dbURL).then(r => r.json()).then(data => {
        let isUnlocked = false;
        if (data) { Object.values(data).forEach(user => { if (user.id === myUID) isUnlocked = true; }); }

        if (isUnlocked) {
            // Background Image Load Check to prevent white screen
            const bgImg = new Image();
            bgImg.src = "feed-thumb.jpg";
            bgImg.onload = () => {
                overlay.remove();
                startApp();
            };
            bgImg.onerror = () => {
                console.error("feed-thumb.jpg not found in folder");
                overlay.innerHTML = '<div style="color:orange;">Background Image (feed-thumb.jpg) Missing!</div>';
                setTimeout(() => { overlay.remove(); startApp(); }, 2000);
            };
        } else {
            overlay.innerHTML = `
                <div class="ahmad-white-box">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png" width="60">
                    <div class="ahmad-lock-title">LOCKED</div>
                    <div class="ahmad-id-box">${myUID}</div>
                    <p style="font-size:13px; color:#333;">Contact Admin to Access<br><strong>Whatsapp: +923120883884</strong></p>
                </div>`;
        }
    });

    /* --- 3. MAIN APPLICATION --- */
    function startApp() {
        const names = ["MD Zeeshan", "Faiza", "Bilal", "Alyan", "Ajay", "Fatima", "Aliya", "Sania", "Ali"];
        const msgs = ["Win Sure shot", "100% Signal working", "Profit booked", "Thanks bhai", "Wow session", "Maza aa gaya"];

        // Show Generator Modal (Old Style)
        function showOldStyleModal() {
            var t = new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute:'2-digit', hour12: true });
            var dia = document.createElement("dialog");
            dia.style = "border:none; border-radius:15px; padding:25px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.5);";
            dia.innerHTML = `
                <div style="font-family:monospace;">
                    <h2 style="margin-bottom:15px;">FEEDBACK GEN</h2>
                    <label>SET TIME (AM/PM):</label><br>
                    <input id="timeInput" type="text" value="${t}" style="width:150px; padding:8px; margin:10px 0; text-align:center; border:1px solid #ccc;"><br>
                    <button id="runBtn" style="padding:10px 30px; background:#34ace1; color:white; border:none; cursor:pointer; font-weight:bold; border-radius:5px;">RUN CODE</button>
                </div>`;
            document.body.appendChild(dia);
            dia.showModal();

            dia.querySelector("#runBtn").onclick = () => {
                dia.close();
                renderChats(document.querySelector("#timeInput").value);
            };
        }

        function renderChats(fullTime) {
            const box = document.querySelector("#box");
            box.style.display = "block";

            // 1. Status Bar: Sirf Time (No AM/PM)
            document.querySelector(".status_time").innerHTML = fullTime.replace(/AM|PM|\s/gi, "");

            document.body.contentEditable = true;
            const tops = [152, 223, 296, 368, 440, 512, 585, 656, 729];
            const dpTops = [144, 216, 287, 361, 434, 506, 579, 650, 722];
            let shuffledNames = [...names].sort(() => 0.5 - Math.random());

            document.querySelectorAll('ul').forEach(ul => ul.innerHTML = "");

            for (let i = 0; i < 9; i++) {
                // Name & Time (Time with AM/PM for chats)
                document.querySelector(".ul_chat_name").innerHTML += `<li class="chat_name" style="top:${tops[i]}px; left:76px;">${shuffledNames[i]}</li>`;
                document.querySelector(".ul_chat_time").innerHTML += `<li class="chat_time" style="top:${tops[i]+1}px;">${fullTime}</li>`;

                // DP Logic (dp1.png - dp30.png)
                let rDP = Math.floor(Math.random() * 30) + 1;
                let dpContent = (Math.random() > 0.4) 
                    ? `<img src="dp${rDP}.png">` 
                    : `<span class="chat_named_dp" style="background:hsl(${i*45},70%,50%)">${shuffledNames[i][0]}</span>`;
                document.querySelector(".ul_chat_dp").innerHTML += `<li class="chat_dp" style="top:${dpTops[i]}px; left:7px;">${dpContent}</li>`;

                // Message Image Logic (1.png - 30.png)
                let rImg = Math.floor(Math.random() * 30) + 1;
                let rTxt = msgs[Math.floor(Math.random()*msgs.length)];
                let msgContent = (Math.random() > 0.4)
                    ? `<img src="${rImg}.png"> <span class="msg_span_img">Photo</span>`
                    : `<span class="msg_span_text_alone">${rTxt}</span>`;
                document.querySelector(".ul_msg_img").innerHTML += `<li class="msg_img" style="top:${tops[i]+24}px; left:76px;">${msgContent}</li>`;

                // Count Bullet
                document.querySelector(".ul_count_bullet").innerHTML += `<li class="count_bullet" style="top:${tops[i]+24}px; left:321px;">${Math.floor(Math.random()*5)+1}</li>`;
            }
        }

        // --- ULTRA HD DOWNLOAD SYSTEM ---
        const dlBtn = document.querySelector(".btn");
        if(dlBtn) {
            dlBtn.onclick = function() {
                this.innerText = "PLEASE WAIT...";
                this.style.opacity = "0.6";
                document.body.contentEditable = false;

                html2canvas(document.querySelector("#box"), {
                    scale: 4, // Ultra Sharp Quality
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: "#ffffff"
                }).then(canvas => {
                    const link = document.createElement("a");
                    link.download = `Android_Feedback_${Date.now()}.png`;
                    link.href = canvas.toDataURL("image/png", 1.0);
                    link.click();
                    
                    this.innerText = "DOWNLOAD FEEDBACK";
                    this.style.opacity = "1";
                    document.body.contentEditable = true;
                });
            };
        }

        showOldStyleModal();
    }
})();
