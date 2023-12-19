(async function() {

    const ws = await connectToServer();    

    ws.onmessage = (webSocketMessage) => {
        const messageBody = JSON.parse(webSocketMessage.data);
        const cursor = getOrCreateCursorFor(messageBody);
        cursor.style.transform = `translate(${messageBody.x}px, ${messageBody.y}px)`;
        cursor.getElementsByTagName('text')[0].textContent = messageBody.name;     
    };        
    
    document.body.onmousemove = (evt) => {
        const messageBody = { x: evt.clientX, y: evt.clientY, name: username.value };
        ws.send(JSON.stringify(messageBody));
    };
        
    async function connectToServer() {    
        const ws = new WebSocket('ws://class.clvrclvr.com:8080/ws');
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if(ws.readyState === 1) {
                    clearInterval(timer);
                    resolve(ws);
                }
            }, 10);
        });   
    }

    function getOrCreateCursorFor(messageBody) {
        const sender = messageBody.sender;
        const existing = document.querySelector(`[data-sender='${sender}']`);
        if (existing) {
            return existing;
        }
        
        const template = document.getElementById('cursor');
        const cursor = template.content.firstElementChild.cloneNode(true);
        const svgPath = cursor.getElementsByTagName('path')[0];    
        const svgText = cursor.getElementsByTagName('text')[0];    
            
        cursor.setAttribute("data-sender", sender);
        svgPath.setAttribute('fill', `hsl(${messageBody.color}, 50%, 50%)`);  
        svgText.textContent = username.value;      
        document.body.appendChild(cursor);

        return cursor;
    }


})();

document.addEventListener("DOMContentLoaded", e=>{
    window.username.value = Math.random().toString()
});