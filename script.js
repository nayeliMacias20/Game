/*
//Ejemplo funcion flecha

const $app = document.getElementById('app');

class Gato{
    constructor(){
        this.color='Cafe';
        window.addEventListener('keydown',e=>{
            //El funcion tapa el valor del this.
            setTimeout(()=>{
                //setTimeout(function(){
                $app.innerHTML += `<h5>${this.color}</h5>`;
            })
            //window.addEventListener('keydown',function(e){
           
        });
    }
}
const gato = new Gato();
*/

//Creamos el evento en el cual estará todo.
window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext("2d")
    //Asignamos las medidas de ancho y altura
    canvas.width = 500;
    canvas.height = 500;


    //Clase InputHandler para manipular cuando oprimimos las teclas
    class InputHandler{
        //Lo pasamos game como una propiedad, manejará el input, con el teclado manejaremos el mov.
        constructor(game){
            this.game = game;
            //este es para cuando opriman la tecla de arriba
            //Primera condicició "-1" significa que no tenga nada con la que con lo que se oprime en el momento.
            window.addEventListener('keydown', e =>{
                if(( (e.key==='ArrowUp') || 
                     (e.key==='ArrowDown')
                ) && this.game.keys.indexOf(e.key) === -1){
                //Con la funcion se conoce este array.
                    this.game.keys.push(e.key);
                //Maneja los disparos
                }else if(e.key === ' '){
                //Barra espaciadora
                    this.game.player.shootTop()
                }
                else if(e.key === 'd'){
                //Modo debug
                //! -> toogle cambiara al contrario.
                    this.game.debug = !this.game.debug;
                }
            });
            //Cuando suelte la tecla
            window.addEventListener("keyup",  e=> {
                //Indexof nos maneja los indices y busca si existe la tecla o se oprimio la tecla que tiene el evento.
                if(this.game.keys.indexOf(e.key) > -1) {
                //Toma la posicion y el 1 elimina//this.game.keys.splice(this.game.keys.indexOf(e.key),1);
                    this.game.keys.splice(this.game.keys.indexOf(e.key),1)
                }
                console.log(this.game.keys);
                //console.log(this.game.keys);
                //Consol log del array de keys.)
            })
        }
    }
//Clase de proyectiles
    class Projectile{
        constructor(game, x, y ){
            //Pasamos el objeto
            this.game = game;
            //Mandamos a llamar la clase Game.
            this.x = x;
            this.y = y;
            //Pasamos el tamaño que lanzará los proyectiles
            this.width = 10;
            this.height = 3;
            //Se realizo cambio estaba en 3
            this.speed= 6;
            //Eliminamos el objeto cuando se salga del área
            this.markedForDeletion = false;
            //Ponemos un sonido cuando se dispara
            this.clickAudio = new Audio('./sounds/shot.wav');
        }
        update(){
            //Se vaya actualizando y vaya agarrando velocidad.
            this.x += this.speed;
            if(this.x > this.game.width * 0.8){
                this.markedForDeletion = true
            }
        }
        //Pintamos los proyectiles.
        draw(context){
            //Los proyectiles tomarán el color amarillo
           context.fillStyle = 'red';
            this.clickAudio.play();
            context.fillRect(this.x,this.y,this.width,this.height);
        }
    }
//Clase Jugador
    class Player {
        //Le pasamos el objeto juego, que se va a convertir en una propiedad de player
        constructor(game){
            this.game = game;
            //Declaramos las medidas
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 1;
            this.speedY = 0;
            this.maxSpeed = 1; 
            //Se crea un arreglo para los projectiles.
            this.projectiles = [];
            //Imagen del jugador
            this.image =  document.getElementById('player');
            this.maxFrame = 37;
            

        }
        //Actualizar las teclas.
        update(){
            if(this.game.keys.includes('ArrowUp')){
                //this.speedY = -1;
                this.speedY = -this.maxSpeed;
            }else if(this.game.keys.includes('ArrowDown')){
                //this.speedY = 1;
                this.speedY = this.maxSpeed;
            }else{
                this.speedY = 0;
                //Esto hace que se mueva cuando uno mueva las flechas.
            }

            this.y += this.speedY;
             //For each de projectiles
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
             //Si no estan marcados los va borrando
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }
            else{
                this.frameX = 0;
            }
        }
         //Dibujar la linea
        draw(context){
            if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            //this.black = this.black?false:true
            //context.fillStyle = 'black'
            //context.fillRect(this.x,this.y, this.width,this.height);
            context.drawImage(this.image,//Imagen que se le asigno
                              //Para crear la animación
                              //sx, sy, sw, sh -> source de cada uno
                              this.frameX* this.width,
                              this.frameY*this.height,
                              this.width, this.height,
                              this.x, this.y,
                              this.width, this.height );        
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
            //this.black = this.black?false:true;
            //context.fillStyle = this.black?'black':'white';          
        }
        //Funcion para los projectiles
        shootTop(){
            if(this.game.ammo >0){
                this.projectiles.push(new Projectile(this.game, this.x+80, this.y+30));
                this.game.ammo--;
             }
        }
    }
    //Clase enemigo
    class Enemy{
        constructor(game){
            this.game = game;
            //Variable x es igual a width
            this.x = this.game.width;
            //Se crea la variable de velocidad para los enemigos.
            this.speedX = Math.random()*-1.5-0.5;
            //Variable para eliminarlos
            this.markedForDeletion = false;       
            //Vidas de los enemigos
            this.lives = 10;
            //Score tomado de las vias
            this.score = this.lives;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;

        }
        //Se crea la función de update
        update(){
            this.x += this.speedX;
            if(this.x + this.width < 0){
                this.markedForDeletion = true;
            }  
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }else{
                this.frameX = 0;
            }
        }
        draw(context){
            //context.fillStyle = 'red';
            //context.fillRect(this.x, this.y, this.width, this.height);
           if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            //Pintar las vidas cuando se vayan terminando
            //context.fillStyle = 'black';
            //Agregamos la imagen
            context.drawImage(this.image, 
                              this.frameX * this.width,
                              this.frameY * this.height,
                              this.width, this.height,
                              this.x, this.y,
                              this.width, this.height,
                            );  
            context.font = '20px Helvetica';
            context.fillText(this.lives, this.x, this.y);
        }
    }
    //Clase Angler 1 
    class Angler1 extends Enemy{
        constructor(game){
            super(game);
            //Para que se vena los cuadrtos
            //this.width = 228*0.2;
            this.width = 228;
            this.height = 169;
            this.y = Math.random()*(this.game.height*0.9-this.height)
            //Imagen del enemigo
            this.image = document.getElementById('angler1');
            this.frameY =  Math.floor(Math.random()*3);
        }
    }
 //Clase layer
    class Layer{
        constructor(game, image, speedModifier){
            //Parametros para que los tome la clase
            this.game =  game;
            this.image = image;
            this.speedModifier =  speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }
        update(){
            //la imagen va a ir corriendo de fondo y cuando mida el ancho de la imagen se reseteará
            //Cuando llegue a 0
            if(this.x <= -this.width)this.x = 0;
            //Y si no se va a estar aumentando.
            //Quitandole el else es para que no se vea la pausa
            this.x -=  this.game.speed * this.speedModifier;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }
    }
     // clase de background
     class Background{
        constructor(game){
            this.game =  game;
            //Sacar la imagen
            this.image1 =  document.getElementById('layer1');
            this.image2 =  document.getElementById('layer2');
            this.image3 =  document.getElementById('layer3');
            this.image4 =  document.getElementById('layer4');
            //Creamos una nueva instancia
            //el 1 es la velocidad 
            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.4);
            this.layer3 = new Layer(this.game, this.image3, 1.2);
            this.layer4 = new Layer(this.game, this.image4, 1.7);
            //Array, el primer objeto es layer1.
            //this.layers = [this.layer1, this.layer2, this.layer3, this.layer4];
            this.layers = [this.layer1, this.layer2, this.layer3];  
        }
        //Update de los layers
        update(){
            this.layers.forEach(layer=>layer.update());
        }
        //Dibujamos de los layers
        draw(context){
            //para que se vaya actualizando
            this.layers.forEach(layer=>layer.draw(context));
        }
    }
    //Clase UI
    class UI{
        constructor(game){
            this.game = game;
            this.fontSize = 15;
            this.fontFamily= 'Arial, Helvetica, sans-serif';
            this.color = 'yellow'
        }

        draw(context){
            //Guardarlo 
            context.save();
            context.fillStyle = this.color;
            //Sombras
            context.shadowOffsetX = 2;
            context.shadowOffsety = 1;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px'+ this.fontFamily;
            context.fillText('Score: ' + this.game.score, 20, 40);
            
            for(let i=0;i<this.game.ammo;i++){
                context.fillRect(20+5*i,50,3,20);
            }
            //Creamos una variable para los milisegundos y quitamos los decimales
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Timer: '+ formattedTime,20,100);
            if(this.game.gameOver){
                context.textAlign = 'center';
                let message1;
                let message2;
                if(this.game.score > this.game.winningScore){
                    message1 = 'You Win :)';
                    message2 = 'Well done...';
                } 
                else{
                    message1 = 'You lose Xp';
                    message2 = 'Try Again!!';
                }
                context.font = '50px ' + this.fontFamily;
              
                context.fillText(message1,
                                this.game.width*0.5,
                                this.game.height*0.5-20);   
                context.font = '25px ' + this.fontFamily; 
                context.fillText(message2,
                                this.game.width*0.5,
                                this.game.height*0.5+20);
            }
            //Lo restauramos aunque esta ya guardado arriba.
            context.restore();
        }
    }
   //Clase Juego
    class Game{
        constructor(width, height){
            //Parametros
            this.width = width;
            this.height = height;
            //Creamos el jugador
            this.player = new Player(this);
            //para crear la nueva clase inputHandler
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            //Llamamos background
            this.background = new Background(this);
            //Agregamos un array vacio
            this.keys =  [];            
            this.ammo = 20;
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.maxAmmo = 60;
            this.enemies= [];
            this.enemyTimer = 0;
            //Modificación
            this.enmyInterval = 500;
            this.gameOver = false
            this.score = 0;
            //Puntaje para ganar
            this.winningScore = 20;
            this.gameTime = 0;
            this.timeLimit = 10000;
            this.speed =  1;
            this.debug = false;
        }
        update(deltaTime){
            if(!this.gameOver) this.gameTime += deltaTime;
            //Comparamos para ponerle un true, si ya paso el tiempo termina el juego
            if(this.gameTime > this.timeLimit) this.gameOver = true;
            //mandamos a llamar el update de background
            this.background.update();
            this.background.layer4.update();

            this.player.update();
            if(this.ammoTimer > this.ammoInterval){
                if(this.ammo < this.maxAmmo){
                    this.ammo++;
                    this.ammoTimer = 0;
                }
            }else{
                this.ammoTimer += deltaTime
            }
            this.enemies.forEach(enemy=>{
                enemy.update();
                //condicion if
                if(this.checkCollision(this.player, enemy)){
                    //Elimina al enemigo cuando pasa el rectangulo
                    enemy.markedForDeletion = true;

                }
                this.player.projectiles.forEach(projectile=>{
                    if(this.checkCollision(projectile,enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if(enemy.lives <= 0){
                            enemy.markedForDeletion = true;
                            //Suma los puntos
                            if(!this.gameOver)this.score += enemy.score;
                            if(this.score > this.winningScore)this.gameOver = true;
                        }
                    }
                });
            });
            this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion);
            if(this.enemyTimer > this.enmyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltaTime;
            }
        }
        draw(context){
            //debe de ser el primero
            //es el fondo
            this.background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
            });
            //Pintamos
            this.background.layer4.draw(context);
        }
        //Añadimos a los enemigos
        addEnemy(){
            this.enemies.push(new Angler1(this));
        }
        //Metodo checar colisiones
        checkCollision(rect1, rect2){
            return(rect1.x < rect2.x + rect2.width
                    && rect1.x + rect1.width > rect2.x
                    && rect1.y < rect2.y + rect2.height
                    && rect1.height + rect1.y > rect2.y
            )
        }
    }
    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    //Funcion de animación
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        //Limpia la imagen
        ctx.clearRect(0,0,canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);        
        requestAnimationFrame(animate);
    }
    animate(0);
});


