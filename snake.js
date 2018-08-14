FIELD_SIZE = 20;

START_SNAKE_SIZE = 3;

D_UP = 1
D_RIGHT = 2
D_DOWN = 3
D_LEFT = 4


TIMER = 250

 K_UP = 38
 K_DOWN = 40
 K_LEFT = 37
K_RIGHT = 39
K_SPACE = 32
function high(){
  cookie = readCookie(Highscore)
  if (cookie){
    document.getElementsByTagName('bold').innerHTML = Highscore
  } else {
    document.getElementsByTagName('bold').innerHTML = 0
  }
}
function getRandomArbitrary(min, max) {
  var rand = min + Math.random() * (max - min)
  rand = Math.round(rand);
  return rand;
}

let Field = class {

  constructor(field) {
  var father = document.getElementById('lol')
  for (let j = 1; j <= FIELD_SIZE ; j++) {
  for (let i = 1; i <= FIELD_SIZE ; i++) {
    let son = document.createElement('div')

    son.className = i +"_"+j + " b"
    field.appendChild(son)
  }
    field.appendChild(document.createElement('br'))
}
this.field = field
this.score = 0
this.apple = new Apple(this)
this.snake = new Snake(this)
//startGame()
}

onKeyDown(e){

  let key = e.keyCode
  let snake = this.snake
  let dir = snake.getSnakeDirection()
  if(snake.ChangeD){
    return false
  }
  if (snake == null){
    if(key == K_SPACE){
      location.reload()
    }
  }
  if ((key ==K_UP)&&(dir!=D_DOWN)){
    snake.setSnakeDirection(D_UP)
  }
  if ((key ==K_DOWN)&&(dir!=D_UP)){
    snake.setSnakeDirection(D_DOWN)
  }
  if ((key ==K_LEFT)&&(dir!=D_RIGHT)){
    snake.setSnakeDirection(D_LEFT)
  }
  if ((key ==K_RIGHT)&&(dir!=D_LEFT)){
    snake.setSnakeDirection(D_RIGHT)
  }
  if (key == K_SPACE){
    snake.changeGameState()
    document.getElementById("cons").innerHTML = snake.getGameState()
  }
  snake.ChangeD = true
}
getCell(x,y){
      return this.field.getElementsByClassName(x+"_"+y)[0];
}
changeCell(x,y,color){
  let cell = this.getCell(x,y)
  cell.className = (x+"_"+y+" " + color);
}
isEmpty(x,y){
  return(this.whatInCell(x,y) == "b")
}
whatInCell(x,y){
  let cell = this.getCell(x,y);
  if(cell.classList.contains('b'))
    return "b"
if(cell.classList.contains('a'))
    return "a"
  if(cell.classList.contains('s'))
    return "s"


}
increaseScore(){
  this.score++
}
gameover(){
  document.getElementById("cons").innerHTML = "Game Over. Press Space to try again"
  var person = prompt("Your Score ="+this.score+" Enter your name","noname" )

  if (this.score>parseInt(document.getElementsByTagName('bold')[0])){
    writeCookie('Highscore',this.score,10)
  }

  this.snake = null
  this.apple = null
  location.reload()
  window.location.reload(false);

}
}
let Apple = class {
  constructor(ParentField){
    this.x=0
    this.y=0
    this.ParentField = ParentField
    this.setApple()
  }

  setApple(){
    this.x = getRandomArbitrary(1,FIELD_SIZE)
    this.y = getRandomArbitrary(1,FIELD_SIZE)
    if(this.ParentField.isEmpty(this.x,this.y)){
      this.draw()
    } else{
      setApple()
    }
  }
  draw(){
    this.ParentField.changeCell(this.x,this.y,"a")
  }
}
let Snake = class{
  constructor(ParentField){
    this.x=0
    this.y=0
    this.ChangeD = false
    this.gameState = false
    this.direction = D_DOWN
    this.length = START_SNAKE_SIZE
    this.arr = []
    this.ParentField = ParentField
    var self = this
    this.snakeInterval = setInterval(function(){self.stepSnake()},TIMER)
    this.setSnake()

  }
  unsetInterval(){
    clearInterval(this.snakeInterval)
  }
 setSnake(){
           this.x = getRandomArbitrary(1,FIELD_SIZE)
           this.y = getRandomArbitrary(1,FIELD_SIZE - START_SNAKE_SIZE)
           for (var i = this.y; i <this.y+START_SNAKE_SIZE; i++) {
            this.ParentField.getCell(this.x,i).className = (this.x+"_"+i+" s")
             this.arr.unshift({x:this.x, y:i})
    }
}
getSnakeDirection(){
  return this.direction;
}

changeGameState(){
  this.game = !this.game
}
drawSnake(){
  for (var i = 0; i < this.arr.length; i++) {
      this.ParentField.getCell(this.arr[i].x,this.arr[i].y).className = (this.arr[i].x+"_"+this.arr[i].y+" s")
  }
}
setSnakeDirection(dir){
  this.direction = dir
}
getGameState(){
  if (this.game)
    return "Gooood luck"
    else {
      return "Game Paused:("
    }
}
  stepSnake(){
    if (this.game){
      this.ChangeD = false
    let tail =this.arr[this.arr.length-1]
    let head =  {x:1, y:1}
    head.x=this.arr[0].x
    head.y=this.arr[0].y

    switch (this.direction) {
      case D_UP:
      head.y--
        break;
      case D_RIGHT:
      head.x++
        break;
      case D_DOWN:
      head.y++
        break;
      case D_LEFT:
      head.x--
        break;

    }
    if (   head.x<1 || head.x>FIELD_SIZE || head.y<1 || head.y>FIELD_SIZE || this.ParentField.whatInCell(head.x,head.y) == 's' ){//
      this.unsetInterval()
      this.changeGameState()
      this.ParentField.gameover()

    }

    if (this.ParentField.whatInCell(head.x,head.y)!='a'){
    this.arr.pop()
  } else {
    this.ParentField.apple.setApple()
    this.ParentField.increaseScore()
  }


    this.ParentField.changeCell(head.x,head.y,'s')
    this.ParentField.changeCell(tail.x,tail.y,'b')
    this.arr.unshift(head)


    this.drawSnake()

}
}
}
