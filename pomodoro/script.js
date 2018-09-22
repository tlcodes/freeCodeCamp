let running = false;
        let sessionTime = true;        
        let sessionLength = parseInt(document.getElementById('session-length').innerText)*60;
        let breakLength = parseInt(document.getElementById('break-length').innerText)*60;
        const beep = document.getElementById('beep');
        let timeLeft = document.getElementById('time-left').innerText;

        document.addEventListener('click', event => {
            if (event.target.id.endsWith('increment')) {
                if (running) {return;}
                increment(parseInt(event.target.previousElementSibling.innerText), event.target.previousElementSibling);
                setTimer();
            } else if (event.target.id.endsWith('decrement')) {
                if (running) {return;}
                decrement(parseInt(event.target.nextElementSibling.innerText), event.target.nextElementSibling);                       
                setTimer();
            } else if (event.target.id === 'start_stop') {
                running = !running;
                timer();
            } else if (event.target.id === 'reset') {
                resetTimer();
            }
        });
        
        function timer(){
            if (running) {
                if (sessionTime) {                    
                    document.getElementById('time-left').innerText = renderTime(Math.floor(sessionLength/60)) + ':' + renderTime(sessionLength%60);
                    sessionLength--;
                    if (sessionLength < 0) {
                        beep.currentTime = 0;
                        beep.play();
                        sessionTime = false;
                        sessionLength = parseInt(document.getElementById('session-length').innerText)*60;
                        document.getElementById('timer-label').innerText = 'Break';
                    }                    
                } else {
                    document.getElementById('time-left').innerText = renderTime(Math.floor(breakLength/60)) + ':' + renderTime(breakLength%60);
                    breakLength--;
                    if (breakLength < 0) {
                        beep.currentTime = 0;
                        beep.play();
                        sessionTime = true;
                        breakLength = parseInt(document.getElementById('break-length').innerText)*60;
                        document.getElementById('timer-label').innerText = 'Session';
                    }
                }                
                setTimeout(timer, 1000);
            }
        }

        function setTimer() {
            clearTimeout(timer);
            // running = false;
            document.getElementById('timer-label').innerText = 'Session';
            sessionLength = parseInt(document.getElementById('session-length').innerText)*60;
            breakLength = parseInt(document.getElementById('break-length').innerText)*60;
            document.getElementById('time-left').innerText = renderTime(Math.floor(sessionLength/60)) + ':' + renderTime(sessionLength%60);
            
        }

        function resetTimer() {
            clearTimeout(timer);
            running = false;            
            document.getElementById('timer-label').innerText = 'Session';
            document.getElementById('session-length').innerText = "25";
            document.getElementById('break-length').innerText = "5";
            document.getElementById('time-left').innerText = "25:00";
            beep.pause();
            beep.currentTime = 0;
        }

        function renderTime(time){
            return time < 10 ? '0'+ time : time;
        }

        function increment(length, elem) {
            if (length === 60) {
                return;
            }
            length++;
            elem.innerText = length.toString();
        }
        function decrement(length, elem) {
            if (length === 1) {
                return;
            }
            length--;
            elem.innerText = length.toString();
        }