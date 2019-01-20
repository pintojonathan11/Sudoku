var solution_board=[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0]];

var theTimer=document.querySelector("#timer");
var timer = [0,0,0,0];
var interval;
var timerRunning = false;
var hasGivenUp=false;

function checkGrid(board,num,row,col){
  var boundRow1=0,boundRow2=0,boundCol1=0,boundCol2=0;
  var count=0;
  if(row<3){
    boundRow1=0;
    boundRow2=3;
  }
  else if(row<6){
    boundRow1=3;
    boundRow2=6;
  }
  else if(row<9){
    boundRow1=6;
    boundRow2=9;
  }
  if(col<3){
    boundCol1=0;
    boundCol2=3;
  }
  else if(col<6){
    boundCol1=3;
    boundCol2=6;
  }
  else if(col<9){
    boundCol1=6;
    boundCol2=9;
  }
  var i,j;
  for(i=boundRow1;i<boundRow2;i++){
    for(j=boundCol1;j<boundCol2;j++){
      if(board[i][j]==num){
        count++;//it found it
      }
    }
  }
  return count;//it didnt find it
}

function checkRow(board,num,row){
  var count=0;
  for(var i=0;i<9;i++){
    if(board[row][i]==num){
      count++;
    }
  }
  return count;
}

function checkCol(board,num,col){
  var count=0;
  for(var i=0;i<9;i++){
    if(board[i][col]===num){
      count++;
    }
  }
  return count;
}

function find_possible(board,row,col){
  var ret=[];
  ret[0]=row;
  ret[1]=col;
  var c=2;
  var randomize=[1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9];
  var num=Math.floor((Math.random() * 8) + 0);
  for(var i=0;i<9;i++){
    var checkrow=checkRow(board,randomize[num],row);
    var checkcol=checkCol(board,randomize[num],col);
    var checkgrid=checkGrid(board,randomize[num],row,col);
    //console.log("for num:"+randomize[num]+", "+checkrow+" "+checkcol+" "+checkgrid);
    if(checkrow==0&&checkcol==0&&checkgrid==0){
      ret[c]=randomize[num];
      c++;
    }
    num++;
  }
  return ret;
}//checked and good to go

function smallestSize(all_possible){
  var smallest=9;

  for(var i=0;i<all_possible.length;i++){
    if(smallest>all_possible[i].length-2){
      smallest=all_possible[i].length-2;
    }
  }
  return smallest;
}//checked and good to go

function make_temp_board(board){
  var temp=[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]];
  for(var i=0;i<9;i++){
    for(var j=0;j<9;j++){
      temp[i][j]=board[i][j];
    }
  }
  return temp;
}//good to go

function update_all_possible(board,all_possible){
  all_possible=[[]];
  var i,j;
  var c=0;
  for(i=0;i<9;i++){
    for(j=0;j<9;j++){
      if(board[i][j]==0){
        all_possible[c]=find_possible(board,i,j);
        c++;
      }
    }
  }
  return all_possible;
}//good to go

function checkComplete(board){
  var i,j;
  for(i=0;i<9;i++){
    for(j=0;j<9;j++){
      if(board[i][j]==0){
        return -1;//not complete
      }
    }
  }
  for(var i=0;i<9;i++){
    for(var j=0;j<9;j++){
      solution_board[i][j]=board[i][j];
    }
  }
  //console.log(solution_board);
  for(var i=0;i<9;i++){
    for(var j=0;j<9;j++){
      var num=Math.floor((Math.random() * 10) + 1);
      if(num<6){
        board[i][j]=0;
      }
    }
  }
  if(timerRunning==true){
    clearInterval(interval);
    interval = null;
    timer = [0,0,0,0];
    startTimer();
  }
  else{
    startTimer();
  }
  updateGrid(board);
  return 1;
}

function recurTry(board,all_possible){
  var smallestsize=smallestSize(all_possible);
  var i,j;
  if(smallestsize==0){//The num we picked didnt work
    return -1;//failure
  }
  else if(smallestsize!=1){//we need to make more guesses
    for(i=0;i<all_possible.length;i++){
      if(smallestsize==all_possible[i].length-2){
        var row=all_possible[i][0],col=all_possible[i][1];
        for(j=2;j<all_possible[i].length;j++){//Tries all the vals
          var temp=make_temp_board(board);
          temp[row][col]=all_possible[i][j];
          all_possible=update_all_possible(temp,all_possible);
          var try1=recurTry(temp,all_possible);
          if(try1==1){//The solution worked
            return 1;
          }
          else{
            all_possible=update_all_possible(board,all_possible);
          }
        }
        /*if this comes out of the inner loop means it finished the loop
        which means it found nothing that worked, which means it failed*/
        return -1;
      }
    }
  }
  else{//if smallestSize==1, update every value wtih 1
    var temp=make_temp_board(board);
    for(i=0;i<all_possible.length;i++){
      if((all_possible[i].length)-2==1){
        var row=all_possible[i][0],col=all_possible[i][1];
        temp[row][col]=all_possible[i][2];
      }
    }
    var complete=checkComplete(temp);
    if(complete==1){
      return 1;
    }
    all_possible=update_all_possible(board,all_possible);
    complete=recurTry(temp,all_possible);
    if(complete==1){
      return 1;
    }
    else{
      return -1;
    }
  }
  return 0;//it should never come here though
}

function updateGrid(board){
  var outerArr=document.querySelectorAll('.small-grid');
  var i=0;
  outerArr.forEach(function(element){
    var temp=element.querySelectorAll('.grid-item');
    var j=0;
    temp.forEach(function(e){
      var loc=getLoc(i,j);
      var row=loc[0],col=loc[1];
      if(board[row][col]==0){
        e.innerHTML=" ";
      }
      else{
        e.innerHTML=board[row][col];
      }
      j++;
    });
    i++;
  });
}

function getFromGrid(){
  var board=[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]];
  var outerArr=document.querySelectorAll('.small-grid');
  var i=0;
  outerArr.forEach(function(element){
    var temp=element.querySelectorAll('.grid-item');
    var j=0;
    temp.forEach(function(e){
      var loc=getLoc(i,j);
      var row=loc[0],col=loc[1];
      if(e.innerHTML=="0"){
        board[row][col]=0;
      }
      else{
        board[row][col]=e.innerHTML;
      }
      j++;
    });
    i++;
  });
  return board;
}

function randomize(){
  var board=[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]];
  var all_possible=[[]];//This holds all possible for each index in the board
  var randomize=[1,2,3,4,5,6,7,8,9];
  for(var i=0;i<9;i++){
    var num=Math.floor((Math.random() * randomize.length) + 0);
    board[0][i]=randomize[num];
    randomize.splice(num,1);
  }
  for(var i=0;i<8;i++){
    for(var j=0;j<9;j++){
      all_possible[(i*9)+j]=find_possible(board,i+1,j);
    }
  }
  recurTry(board,all_possible);
}

function leadingZero(time) {
    if (time <= 9) {
        time = "0" + time;
    }
    return time;
}

function runTimer() {
    let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
    theTimer.innerHTML = currentTime;
    timer[3]++;
    if(timer[0]>10){
      giveUpButton.className="show";
    }
    timer[0] = Math.floor((timer[3]/100)/60);
    timer[1] = Math.floor((timer[3]/100) - (timer[0] * 60));
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));
}

function startTimer(){
  timer = [0,0,0,0];
  interval = setInterval(runTimer, 10);
  timerRunning=true;
  hasGivenUp=false;
}

function gaveUp(){
  clearInterval(interval);
  interval = null;
  updateGrid(solution_board);
  hasGivenUp=true;
  giveUpButton.className="";
}

function checkSolution(){
  var snackBar=document.querySelector("#snackbar");
  if(hasGivenUp){
    snackBar.innerHTML="Sorry, but you already gave up";
    snackBar.className="show";
    setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, 3000);
    return;
  }
  var board=getFromGrid();
  for(var i=0;i<9;i++){
    for(var j=0;j<9;j++){
      var val=board[i][j];
      var checkrow=checkRow(board,val,i);
      var checkcol=checkCol(board,val,j);
      var checkgrid=checkGrid(board,val,i,j);
      //console.log("for num:"+randomize[num]+", "+checkrow+" "+checkcol+" "+checkgrid);
      if(checkrow!=1||checkcol!=1||checkgrid!=1){
        //Their Solution Did not work
        return;
      }
    }
  }
  //Solution worked
  snackbar.innerHTML="Congratulations: You Won!";
  snackBar.className="show";
  giveUpButton.className="";
  setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, 3000);
  clearInterval(interval);
  interval = null;
}

var startButton=document.querySelector("#startButton");
startButton.addEventListener("click",randomize,false);
var doneButton=document.querySelector("#doneButton");
doneButton.addEventListener("click",checkSolution,false);
var giveUpButton=document.querySelector("#giveUpButton");
giveUpButton.addEventListener("click",gaveUp,false);

function getLoc(i,j){
  if(i<3){
    if(j<3){
      return [0,i*3+j];
    }
    else if(j<6){
      return [1,i*3+(j-3)];
    }
    else if(j<9){
      return [2,i*3+(j-6)];
    }
  }
  else if(i<6){
    if(j<3){
      return [3,(i-3)*3+j];
    }
    else if(j<6){
      return [4,(i-3)*3+(j-3)];
    }
    else if(j<9){
      return [5,(i-3)*3+(j-6)];
    }
  }
  else if(i<9){
    if(j<3){
      return [6,(i-6)*3+j];
    }
    else if(j<6){
      return [7,(i-6)*3+(j-3)];
    }
    else if(j<9){
      return [8,(i-6)*3+(j-6)];
    }
  }
}
