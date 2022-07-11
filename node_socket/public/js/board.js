var ctx
var socket

$(() => {
    // 소켓 생성
    socket = io.connect('http://localhost:8001', {
        path:'/socket.io',
        transport:['websocket']
    })

    // 소켓에서 linesend_toclient 이벤트가 발생했을 때 처리
    socket.on('linesend_toclient', (data) => {
        draw.drawFromServer(data)
    })

    // console.log('시작하자마자 수행')
    ctx = $('#cv').get(0).getContext('2d')

    $('#cv').bind('mousedown', draw.start)
    $('#cv').bind('mousemove', draw.move)
    $('#cv').bind('mouseup', draw.end)
    $('#clear').bind('click', draw.clear)

    // 색상 선택 select에 추가할 내용
    var color_map = [
        {'value':'white', 'name':'하얀색'},
        {'value':'red', 'name':'빨간색'},
        {'value':'orange', 'name':'주황색'},
        {'value':'yellow', 'name':'노란색'},
        {'value':'blue', 'name':'파랑색'},
        {'value':'black', 'name':'검은색'}
    ]

    // select에 설정
    for(var key in color_map) {
        $('#pen_color').append('<option value=' + color_map[key].value + '>' + color_map[key].name + '</option>')
    }

    // 두께 선택 select 설정
    for(var i=1; i<16; i++) {
        $('#pen_width').append('<option value=' + i + '>' + i + '</option>')
    }  
    
    // select에 이벤트 연결
    $('select').bind('change', shape.change)

    // 기본 설정
    shape.setShape()
})

var shape = {
    color:'white',
    width:1,
    change: function() {
        // JQuery에서 select에서 선택된 항목을 찾을 때 사용
        // JavaScript의 경우는 select객체.options[select객체.selectedIndex].value
        var color = $('#pen_color option:selected').val()
        var width = $('#pen_width option:selected').val()

        shape.setShape(color, width)
    },
    setShape: function(color, width) {
        if(color != null) {
            this.color = color;
        }

        if(width != null) {
            this.width = width
        }

        ctx.strokeStyle = this.color
        ctx.lineWidth = this.width

        // console.log(ctx.strokeStyle)
        // console.log(ctx.lineWidth)
    }
}

var draw = {
    drawing:null,
    start:function(e){
        ctx.beginPath()
        ctx.moveTo(e.pageX, e.pageY)

        this.drawing = true

        // console.log('마우스 버튼 누름')

        msg.line.send('start', e.pageX, e.pageY)
    },
    move:function(e){
        if(this.drawing) {
            ctx.lineTo(e.pageX, e.pageY)
            ctx.stroke()
            
            // console.log('마우스 움직임')
            msg.line.send('move', e.pageX, e.pageY)
        }
    },
    end:function(e){
        this.drawing = false

        // console.log('마우스에서 손을 뗌')
        msg.line.send('end')
    },
    clear:function(){
        ctx.clearRect(0, 0, cv.width, cv.height)
        msg.line.send('clear')
    },
    drawFromServer:function(data) {
        if(data.type=='start') {
            ctx.beginPath()
            ctx.moveTo(data.x, data.y)
            ctx.strokeStyle = data.color
            ctx.lineWidth = data.width         
        } 
        if(data.type=='move') {
            ctx.lineTo(data.x, data.y)
            ctx.stroke()
        } 
        if(data.type=='end') {
        } 
        if(data.type=='clear') {
            ctx.clearRect(0, 0, cv.width, cv.height)
            shape.setShape()
        }
    }
}

var msg = {
    line:{
        send:function(type, x, y) {
            socket.emit('linesend', {
                'type':type,
                'x':x,
                'y':y,
                'color':shape.color,
                'width':shape.width
            })
        }
    }
}