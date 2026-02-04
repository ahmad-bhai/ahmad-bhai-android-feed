(function() {
    /* --- 1. CONFIG & SYSTEM SETTINGS --- */
    const projectID = "reactions-maker-site"; 
    const dbURL = `https://${projectID}-default-rtdb.firebaseio.com/users.json`;

    let myUID = localStorage.getItem('ahmad_script_uid');
    if (!myUID) {
        myUID = ""; 
        for (let i = 0; i < 20; i++) myUID += Math.floor(Math.random() * 10);
        localStorage.setItem('ahmad_script_uid', myUID);
    }

    var style = document.createElement('style');
    style.innerHTML = `
        .ahmad-lock-overlay { position:fixed; inset:0; background:#181a20; z-index:99999; display:flex; justify-content:center; align-items:center; font-family:sans-serif; }
        .ahmad-white-box { background:#fff; padding:30px; border-radius:20px; text-align:center; width:310px; box-shadow:0 10px 40px rgba(0,0,0,0.5); }
        .ahmad-id-box { color:#000; margin:15px 0; font-family:monospace; font-weight:bold; font-size:15px; background:#f1f5f9; padding:12px; border-radius:8px; border:1px dashed #34ace1; }
        
        dialog { border:none; border-radius:15px; padding:0; width:320px; box-shadow:0 20px 50px rgba(0,0,0,0.5); margin:auto; }
        dialog::backdrop { background: rgba(24,26,32,0.95); backdrop-filter: blur(4px); }
        .modal-header { background:#34ace1; color:white; padding:15px; text-align:center; font-weight:bold; }
        .modal-body { padding:20px; display:flex; flex-direction:column; gap:12px; font-family:sans-serif; }
        .modal-body input { padding:10px; border:1px solid #ddd; border-radius:5px; text-align:center; outline:none; }
        .run-btn { background:#34ace1; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer; }
        
        .online_bullet { position:absolute; width:13px; height:13px; border-radius:50%; z-index:10; }
        .dark-dot { border: 2px solid #000 !important; background: #fe76b8 !important; }
        .light-dot { border: 2px solid #fff !important; background: #59bf4a !important; }
    `;
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.className = 'ahmad-lock-overlay';
    overlay.innerHTML = '<div style="color:white; font-size:18px;">INITIALIZING...</div>';
    document.body.appendChild(overlay);

    /* --- 2. AUTH CHECK --- */
    fetch(dbURL).then(r => r.json()).then(data => {
        let isUnlocked = false;
        if (data) { Object.values(data).forEach(user => { if (user.id === myUID) isUnlocked = true; }); }
        if (isUnlocked) { overlay.remove(); startApp(); } 
        else { overlay.innerHTML = `<div class="ahmad-white-box"><div class="ahmad-id-box">${myUID}</div><h2 style="color:red">LOCKED</h2></div>`; }
    });

    /* --- 3. MAIN APP --- */
    function startApp() {
        const namesList = ["MD Zeeshan", "Faiza", "Bilal", "Alyan", "Ajay", "Fatima", "Aliya", "Sania", "Ali"];
        const msgsList = ["Win Sure shot", "100% Signal working", "Profit booked", "Thanks bhai", "Win win", "Join fast"];

        function showSettings() {
            var t = new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute:'2-digit', hour12: true });
            var dia = document.createElement("dialog");
            dia.innerHTML = `
                <div class="modal-header">ANDROID FEEDBACKS</div>
                <div class="modal-body">
                    <input id="timeInp" type="text" value="${t}">
                    <input id="themeInp" type="text" value="W" maxlength="1">
                    <button id="startBtn" class="run-btn">GENERATE</button>
                </div>`;
            document.body.appendChild(dia);
            dia.showModal();

            dia.querySelector("#startBtn").onclick = () => {
                dia.close();
                generate(document.querySelector("#timeInp").value, document.querySelector("#themeInp").value.toLowerCase());
            };
        }

        function generate(fullTime, theme) {
            document.querySelector("#box").style.display = "block";
            document.querySelector(".status_time").innerHTML = fullTime.replace(/AM|PM|\s/gi, "");
            document.body.contentEditable = true;

            const tgPink = "#fe76b8"; 

            if (theme == "b") {
                document.querySelector(".bg_img").src = "feed2-thumb.png"; 
                document.documentElement.style.setProperty('--bg_color', '#181818');
                document.documentElement.style.setProperty('--chat_name', '#cecece');
                document.documentElement.style.setProperty('--fg_color', tgPink); 
                document.documentElement.style.setProperty('--personal_bg', tgPink); 
                document.documentElement.style.setProperty('--chats_bg', '#333333'); 
                document.documentElement.style.setProperty('--personal_text', '#000000'); 
            } else {
                document.querySelector(".bg_img").src = "feed-thumb.png"; 
                document.documentElement.style.setProperty('--bg_color', 'white');
                document.documentElement.style.setProperty('--chat_name', '#000000');
                document.documentElement.style.setProperty('--fg_color', '#59bf4a');
                document.documentElement.style.setProperty('--chats_bg', '#d5e8f7');
                document.documentElement.style.setProperty('--personal_bg', 'white');
                document.documentElement.style.setProperty('--personal_text', '#517da2');
            }

            const tops = [152, 223, 296, 368, 440, 512, 585, 656, 729];
            const dpTops = [144, 216, 287, 361, 434, 506, 579, 650, 722];
            let shuffled = [...namesList].sort(() => 0.5 - Math.random());

            document.querySelectorAll('ul').forEach(ul => ul.innerHTML = "");

            for (let i = 0; i < 9; i++) {
                document.querySelector(".ul_chat_name").innerHTML += `<li class="chat_name" style="top:${tops[i]}px; left:76px;">${shuffled[i]}</li>`;
                document.querySelector(".ul_chat_time").innerHTML += `<li class="chat_time" style="top:${tops[i]+1}px;">${fullTime}</li>`;
                document.querySelector(".ul_chat_dp").innerHTML += `<li class="chat_dp" style="top:${dpTops[i]}px; left:7px;"><img src="dp${Math.floor(Math.random()*30)+1}.png"></li>`;
                
                if(Math.random() > 0.3) {
                    let dotClass = (theme == "b") ? "dark-dot" : "light-dot";
                    document.querySelector(".ul_online_bullet").innerHTML += `<li class="online_bullet ${dotClass}" style="top:${dpTops[i]+42}px; left:50px;"></li>`;
                }

                // --- FULLY RANDOM MESSAGE LOGIC ---
                let msgHtml = "";
                let typeRand = Math.random(); // Random number 0 to 1

                if (typeRand < 0.35) { 
                    // 35% Chance: Photo Icon + Text
                    let rImg = Math.floor(Math.random() * 30) + 1;
                    let color = (Math.random() > 0.5) ? "#61a4c8" : "#747f89"; 
                    msgHtml = `<img src="${rImg}.png" style="width:18px;height:18px;border-radius:2px;vertical-align:middle;"> <span style="color:${color}; margin-left:5px;">Photo</span>`;
                } else if (typeRand < 0.55) {
                    // 20% Chance: Voice Message
                    msgHtml = `<span style="color:#61a4c8;">Voice message</span>`;
                } else {
                    // 45% Chance: Simple Text Message
                    let rMsg = msgsList[Math.floor(Math.random()*msgsList.length)];
                    msgHtml = `<span style="color:#747f89;">${rMsg}</span>`;
                }

                document.querySelector(".ul_msg_img").innerHTML += `<li class="msg_img" style="top:${tops[i]+24}px; left:76px; background:var(--bg_color); display:flex; align-items:center;">${msgHtml}</li>`;
                document.querySelector(".ul_count_bullet").innerHTML += `<li class="count_bullet" style="top:${tops[i]+24}px; left:321px;">${Math.floor(Math.random()*5)+1}</li>`;
            }
        }

        document.querySelector(".btn").onclick = function() {
            html2canvas(document.querySelector("#box"), { scale: 4 }).then(canvas => {
                const a = document.createElement("a");
                a.download = `Android_Random_SS.png`;
                a.href = canvas.toDataURL();
                a.click();
            });
        };
        showSettings();
    }
})();
