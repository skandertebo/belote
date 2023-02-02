if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistration().then(function(registration) {
        if (!registration) {
            navigator.serviceWorker.register('sw.js', {scope: './'}).then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        }
    });
}



let n = parseInt(localStorage.getItem('n')) || 0 , v = parseInt(localStorage.getItem('v')) || 0;
let pendingVScore, pendingNScore;
let prevVScore = null, prevNScore = null;

renderScore(n,v);



document.querySelectorAll('input[type=checkbox]').forEach(function(e){
    e.addEventListener('change', function(event){
        let team = e.id[0];
        if(e.id.startsWith("belote")){
            if(e.checked){
                let letter = e.id.split('-')[1] === 'n'? 'v' : 'n';
                let otherbelote = document.getElementById('belote-'+letter);
                if(otherbelote.checked){
                    otherbelote.checked = false;
                }
            }
        }
        if(e.checked){
            if(e.id[0] == 'n'){
                //uncheck all n
                document.querySelectorAll('input[id^=n]').forEach(function(e){
                    e.checked = false;
                });
                //disable number input for n
                document.getElementById('score-n').disabled = true;
            }
            else if(e.id[0] == 'v'){
                //uncheck all v
                document.querySelectorAll('input[id^=v]').forEach(function(e){
                    e.checked = false;
                });
                //disable number input for v
                document.getElementById('score-v').disabled = true;
            }
            e.checked = true;
            
            let name = e.id.split('-')[1];
            let pendingScore;
            switch(name){
                case 'contre':
                    pendingScore = 320;
                    break;
                case 'surcontre':
                    pendingScore = 640;
                    break;
                case 'capot':
                    pendingScore = 500;
                    break;
                case 'capotarabe':
                    pendingScore = 250
                    break;
                case 'dedans':
                    pendingScore = 160;
                    break;
            }
            if(team == 'n'){
                pendingNScore = pendingScore;
            }
            else if(team == 'v'){
                pendingVScore = pendingScore;
            }
        }
        else{
            if(e.id[0] == 'n'){
                //enable number input for n
                document.getElementById('score-n').disabled = false;
                pendingNScore = document.getElementById('score-n').value;
            }
            else if(e.id[0] == 'v'){
                //enable number input for v
                document.getElementById('score-v').disabled = false;
                pendingVScore = document.getElementById('score-v').value;
            }
        }
    });
});

document.getElementById('score-n').addEventListener('input', function(event){
    pendingNScore = event.target.value;
});

document.getElementById('score-v').addEventListener('input', function(event){
    pendingVScore = event.target.value;
});

document.getElementById('add-score-v').addEventListener('click', function(event){
    if(pendingVScore){
        prevNScore = n;
        prevVScore = v;
        v += parseInt(pendingVScore);
        if(!document.getElementById('score-v').disabled){
            if(document.getElementById('v-case').value==="case"){
                n += 170 - pendingVScore;
            }
            else{
                n += 160 - pendingVScore;
            }
        }
        if(document.getElementById('belote-n').checked){
            if(pendingVScore > 250){
                v += 20;
            }else{
                n += 20;
            }
        }
        if(document.getElementById('belote-v').checked){
            v += 20;
        }

        localStorage.setItem('v', v);
        localStorage.setItem('n', n);
        renderScore(n,v);
        //uncheck all v
        document.querySelectorAll('input[id^=v]').forEach(function(e){
            e.checked = false;
        });
        //empty number input for v
        document.getElementById('score-v').value = '';
        document.getElementById('score-v').disabled = false;

        document.getElementById('undo').disabled = false;
    }
});


document.getElementById('add-score-n').addEventListener('click', function(event){
    if(pendingNScore){
        prevVScore = v;
        prevNScore = n;
        n += parseInt(pendingNScore);
        if(!document.getElementById('score-n').disabled){
            if(document.getElementById('n-case').value==="case"){
                v += 170 - parseInt(pendingNScore);
            }
            else{
                v += 160 - parseInt(pendingNScore);
            }
        }
        if(document.getElementById('belote-v').checked){
            if(pendingNScore > 250){
                n += 20;
            }else{
                v += 20;
            }
        }
        if(document.getElementById('belote-n').checked){
            n += 20;
        }
        localStorage.setItem('n', n);
        localStorage.setItem('v', v);
        renderScore(n,v);
        //uncheck all n
        document.querySelectorAll('input[id^=n]').forEach(function(e){
            e.checked = false;
        });
        //empty number input for n
        document.getElementById('score-n').value = '';
        document.getElementById('score-n').disabled = false;

        document.getElementById('undo').disabled = false;
    }
});

document.getElementById('undo').disabled = true;

document.getElementById('undo').addEventListener('click', function(event){
    if(prevNScore !== null && prevVScore !== null){
        n = prevNScore;
        v = prevVScore;
        localStorage.setItem('n', n);
        localStorage.setItem('v', v);
        renderScore(n,v);
    }
    event.target.disabled = true;	
});

document.getElementById('reset').addEventListener('click', function(event){
    if(n==0 && v==0){
        return;
    }
    prevNScore = n;
    prevVScore = v;
    n = 0;
    v = 0;
    localStorage.setItem('n', n);
    localStorage.setItem('v', v);
    renderScore(n,v);
    document.getElementById('undo').disabled = false;
});

function renderScore(n,v){
    document.getElementById('display-n-score').innerHTML = n;
    document.getElementById('display-v-score').innerHTML = v;
}