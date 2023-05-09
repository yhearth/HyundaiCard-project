
(()=>{
    //1.정보 담기

  
    const sceneInfo = [
        {
           type:'sticky',
           heightNum:5,
           scrollHeight:0,//한 섹션 높이
           obj:{
               container:document.querySelector('#sc_scroll_0'),//섹션 전체 높이
               logo:document.querySelector('#sc_scroll_0 .main_logo'),//logo
               message:document.querySelector('#sc_scroll_0 .main_msg'),//h2
               canvas:document.querySelector('#video-canvas-0'),//컨버스
               context:document.querySelector('#video-canvas-0').getContext('2d'),//2d기능
               videoImages:[],//이미지 그릇

           },
           values:{
              videoImageCount:161,
              imageSequence:[0,160],


              logo_translateY_out:[50, 20 ,{start :0.05,end:0.15}],
              logo_scaleY_out:[1, 0.3 ,{start :0.05,end:0.15}],
              message_opacity_in:[0, 1 ,{start :0.08,end:0.15}],
              message_translateY_in:[20, 0 ,{start :0.08,end:0.15}],


              message_opacity_out:[1, 0 ,{start : 0.25,end:0.35}],
              message_translateY_out:[0, -20 ,{start :0.25,end:0.35}],
              logo_opacity_out:[1, 0 ,{start :0.25,end:0.35}],

              canvas_opacity_in:[0,1,{start:0.3,end:0.35}],



           }
            

        },
        {
            type:'sticky',
            heightNum:1.5,
            scrollHeight:0,//한 섹션 높이
            obj:{
                container:document.querySelector('#sc_scroll_1'),
               // message:document.querySelector('#sc_scroll_1 .main_msg'),//h2
                imgGall:document.querySelector('#sc_scroll_1 .card_wrap'),//카드 이미지
                titleWrap:document.querySelector('#sc_scroll_1 .cont_wrap'),//카드 이미지
                imgGallItem:document.querySelectorAll('#sc_scroll_1 .card_wrap .card_item'),//카드 이미지

         
 
            },
            values:{
                imgGall_opacity_in:[0, 1,{start:0,end:0.14}],
                imgGall_top_in:[55, 50,{start :0.07,end:0.14}],
                imgGall_scale_in:[2, 1 ,{start :0.07,end:0.14}],

                titleWrap_opacity_in:[0, 1 ,{start :0.3,end:0.38}],
                titleWrap_top_in:[80 , 75 ,{start :0.3,end:0.38}]
             }

        },
        {
            type:'normal',
            // heightNum:3,
            scrollHeight:0,//한 섹션 높이
            obj:{
                container:document.querySelector('#sc_scroll_2'),//섹션 전체 높이
            },

        }
    ]


   //2. 구간 스크롤 총길이 구하기
    function setLayout(){
        for(let i = 0 ; i < sceneInfo.length; i++){

            if(sceneInfo[i].type === 'sticky'){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            }else if(sceneInfo[i].type === 'normal'){
                sceneInfo[i].scrollHeight = sceneInfo[i].obj.container.offserHeight + window.innerHeight * 0.5;
            }
            sceneInfo[i].obj.container.style.height = `${sceneInfo[i].scrollHeight}px`
        }

        //새로고침시 스크롤 위치 그대로
        let totalScrollHeight = 0;
        for(let i = 0 ; i < sceneInfo.length; i++){
            totalScrollHeight += sceneInfo[i].scrollHeight;//
            if(totalScrollHeight >= window.pageYOffset){//강제로 현재 값
                currentScene = i;
                break;
            }
        }
        //갱신된 인덱스 활성화
        document.body.setAttribute('id',`show-scene-${currentScene}`)


    }

    //캔버스 추가
    function setCanvasImages(){
       let imgElem;
       //이미지 하나씩 업로드
       for(let i =0; i < sceneInfo[0].values.videoImageCount; i++){
            imgElem = new Image()
            imgElem.src = `./asset/img/nexon_frame/Sequence_${1000 + i}.jpg`;
            sceneInfo[0].obj.videoImages.push(imgElem);
       }

    }
    setCanvasImages()

    //3.섹션 활성화 
    let yOffset = 0;//실시간 스크롤 위치 정보
    let preScrollHeight = 0;//지난 스크롤
    let currentScene = 0;
    let enterNewScene =false;
    function scrollLoop(){
        enterNewScene = false;
        preScrollHeight = 0;//스크롤 할때마다 초기화

        //스크롤값 갱신
        for(let i = 0; i < currentScene; i++){
            //첫 섹션은 0이라 넘어감~
            preScrollHeight += sceneInfo[i].scrollHeight;//첫 섹션의 높이는 먼저 넣는다
        }
        //씬 바뀔때마다 클래스 넣어주기
        if(yOffset > preScrollHeight + sceneInfo[currentScene].scrollHeight){
            enterNewScene = true;
            //내려갈때
            currentScene++
            document.body.setAttribute('id',`show-scene-${currentScene}`)
          
        }
        if(yOffset < preScrollHeight){
            enterNewScene = true;
            //올라갈때
            if(currentScene === 0)return;//브라우저 바운스 효과로 마이너스 방지
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`)
        }
        if(enterNewScene)return
        playAnimation();
       
    }

    function playAnimation(){
       // console.log(currentScene)
        const objs = sceneInfo[currentScene].obj;
        const values =sceneInfo[currentScene].values;
        const currentYOffset = yOffset - preScrollHeight;//활성화 된 섹션 안의 스크롤 위치
        const scrollHeight = sceneInfo[currentScene].scrollHeight;//활성화 된 섹션의 높이
        const scrollRatio = currentYOffset / scrollHeight;// 스크롤 비율
       console.log(scrollRatio,currentScene)
        switch(currentScene){
            case 0:
            let sequence = Math.round(calcValues(values.imageSequence,currentYOffset))
            objs.context.drawImage(objs.videoImages[sequence],0,0)//캔버스에 그려주기
        
             if(scrollRatio <= 0.18){
                objs.logo.style.top =`${calcValues(values.logo_translateY_out,currentYOffset)}%`;
                objs.logo.style.transform =`scale(${calcValues(values.logo_scaleY_out,currentYOffset)})`;
                objs.message.style.opacity = calcValues(values.message_opacity_in,currentYOffset);
                objs.message.style.transform = `translateY(${calcValues(values.message_translateY_in,currentYOffset)}%)`;
             
             }else{
                objs.logo.style.opacity = calcValues(values.logo_opacity_out,currentYOffset);
                objs.message.style.opacity = calcValues(values.message_opacity_out,currentYOffset);
                objs.message.style.transform = `translateY(${calcValues(values.message_translateY_out,currentYOffset)}%)`;
                
             }
             //캔버스
             if(scrollRatio <= 0.35){
                objs.canvas.style.opacity = calcValues(values.canvas_opacity_in,currentYOffset);
             }

            break;

            case 1:
              
                 if(scrollRatio <= 0.2){
                    objs.imgGall.style.opacity = calcValues(values.imgGall_opacity_in,currentYOffset);
                    objs.imgGall.style.transform = `translateX(-50%) scale(${calcValues(values.imgGall_scale_in,currentYOffset)})`;
                    objs.imgGall.style.top = `${calcValues(values.imgGall_top_in,currentYOffset)}%`;
                 }
                 if(scrollRatio <= 0.4){
                    objs.titleWrap.style.opacity = calcValues(values.titleWrap_opacity_in,currentYOffset);
                    objs.titleWrap.style.top = `${calcValues(values.titleWrap_top_in,currentYOffset)}%`;

                 }


            break;

            case 2:

            break;
        }

        if(currentScene === 1 && scrollRatio > 0.14){
            cardChange();
           
        }
      

    }


    const cardArrB = [
        `./asset/img/card_ON_b.png`,
        `./asset/img/card_Everyone_b.png`,
        `./asset/img/card_Kart_b.png`,
        `./asset/img/card_Target_b.png`,
        `./asset/img/card_PinkBean_b.png`,
        `./asset/img/card_Danjin_b.png`,
        `./asset/img/card_Wind_b.png`,
        `./asset/img/card_Fantasy_b.png`,
    ]
    const cardArrF = [
        `./asset/img/card_ON.png`,
        `./asset/img/card_Everyone.png`,
        `./asset/img/card_Kart.png`,
        `./asset/img/card_Target.png`,
        `./asset/img/card_PinkBean.png`,
        `./asset/img/card_Danjin.png`,
        `./asset/img/card_Wind.png`,
        `./asset/img/card_Fantasy.png`,
    ]
    let degree = 5;
    let card = document.querySelectorAll('.card_item')
    function cardChange(){
            for(let i =0; i < card.length; i++){
                let cardImg  = card[i].querySelector('img')
                    card[i].addEventListener("mousemove",(e)=>{
        
                        //cardImg.setAttribute('src','../asset/img/card_NXHCK_DX_b.png');
                        // console.log(e.clientX,card[i].getBoundingClientRect().left,window.pageXOffset)
                         //e.clientX  브라우저 창의 왼쪽 가장자리를 기준으로 마우스 포인터가 위치한 지점의 수평 좌표 값
                         //getBoundingClientRect().left 선택한 요소가 브우 창에서 얼큼 떨어져 있는지(왼쪽 기준)
                         //pageXOffset 가로 방향으로 스클로 얼만큼 된건지
             
                             let x = e.clientX - card[i].getBoundingClientRect().left+ window.pageXOffset;//0 - 0 + 비율
                             let y = e.clientY - card[i].getBoundingClientRect().top  + window.pageYOffset;
                             let rotX = getRange(y, 0, e.currentTarget.getBoundingClientRect().height, degree * -2, degree);
                             let rotY = getRange(x, 0, e.currentTarget.getBoundingClientRect().width, degree * -2, degree);
                     
                             gsap.killTweensOf(cardImg);
                             gsap.to(cardImg, {rotationX: rotX, rotationY: rotY, duration: .5});
                             setTimeout(()=>{
                                 cardImg.setAttribute('src',cardArrB[i]);
                             },100)
                     });
                     card[i].addEventListener('mouseleave',(e)=>{
                         gsap.killTweensOf(cardImg);
                         gsap.to(cardImg, {rotationX: 0, rotationY: 0, duration: 0.5, ease: "sine.out"});
                         setTimeout(()=>{
                             cardImg.setAttribute('src',cardArrF[i]);
                         },100)
                     })  
            }
    }
    function getRange(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

   
   

    //구간별 애니메이셔 수치 계산
    function calcValues(values,currentYOffset){
        let rv//비율의 변수
        const scrollHeight = sceneInfo[currentScene].scrollHeight;//활성 섹션 총 높이
        const scrollRatio = currentYOffset / scrollHeight;//섹션 에서 스크롤한 비율
        if(values.length === 3){//playAnimation 에서 특정 css 속 배열 개수
            const partScrollStart = values[2].start * scrollHeight;//애니메이션 시작 지점
            const partScrollEnd = values[2].end * scrollHeight;//애니메이션 끝날 지점
            const partScrollHeight = partScrollEnd - partScrollStart;//애니메이션 실행 구간 간격 비율값
            
            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            }else if(currentYOffset < partScrollStart){//시작 전
                rv = values[0]//초기값
            }else if(currentYOffset > partScrollEnd){
                rv = values[1]//최종값
            }
        }else {
            rv = scrollRatio *  ( values[1] - values[0]) + values[0]
        }
        return rv;

    }




    window.addEventListener('scroll',()=>{
        yOffset = window.pageYOffset;
        scrollLoop();
    })
    window.addEventListener('load',()=>{
        setLayout();

    })
    window.addEventListener('resize',setLayout);




})();

