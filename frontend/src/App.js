import React, {Component} from 'react';
import Spinner from 'react-spinkit';
import './App.css';
import Header from "./Components/Header";
import $ from 'jquery';

class App extends Component {

    componentDidMount() {
        this.setState({
            width: this.refs.paintRegion.clientWidth,
            height: this.refs.paintRegion.clientHeight,
            top: this.refs.canvas.getBoundingClientRect().top,
            left: this.refs.canvas.getBoundingClientRect().left
        });
    }

    constructor(args) {
        super(args);
        this.state = {
            flag: false,
            previousX: 0,
            previousY: 0,
            currentX: 0,
            currentY: 0
        };
    }

    onMouseMove(event) {
        this.findXY('move', event);
    }

    onMouseDown(event) {
        this.findXY('down', event);
    }

    onMouseUp(event) {
        this.findXY('up', event);
    }

    onMouseOut(event) {
        this.findXY('out', event);
    }

    findXY(res, event) {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');

        if (res === 'down') {
            this.setState({
                previousX: this.state.currentX,
                previousY: this.state.currentY,
                currentX: event.clientX - this.state.left,
                currentY: event.clientY - this.state.top,
                flag: true
            }, function () {
                ctx.beginPath();
                ctx.fillStyle = "black";
                ctx.fillRect(this.state.currentX, this.state.currentY, 6, 6);
                ctx.closePath();
            });
        }
        if (res === 'up' || res === "out") {
            this.setState({flag: false});
        }
        if (res === 'move') {
            if (this.state.flag) {
                this.setState({
                    previousX: this.state.currentX,
                    previousY: this.state.currentY,
                    currentX: event.clientX - this.state.left,
                    currentY: event.clientY - this.state.top
                }, () => {
                    this.draw();
                });
            }
        }
    }

    draw() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(this.state.previousX, this.state.previousY);
        ctx.lineTo(this.state.currentX, this.state.currentY);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.closePath();
    }

    clear() {
        this.refs.canvas.getContext('2d').clearRect(0, 0, this.state.width, this.state.height);
    }

    recognize(event) {
        let data = this.refs.canvas.toDataURL();
        console.log(data.length);
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8080/api/v1/recognize',
            data: {image: data},
            success: () => {

            },
            error: function () {
                console.log("error");
            }
        });
    }

    render() {
        return (
            <div className="container">
                <Header/>
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">

                        <div id="loading-overlay">
                            <Spinner id="spinner-loading" style={{'display': 'none'}} name="ball-grid-pulse"
                                     ref="spinner"/>
                        </div>

                        <div className="col-md-6">
                            <div id="paintRegion" className="col-md-12 paint-region" ref="paintRegion">
                                <canvas width={this.state.width}
                                        height={this.state.height}
                                        onMouseMove={this.onMouseMove.bind(this)}
                                        onMouseDown={this.onMouseDown.bind(this)}
                                        onMouseUp={this.onMouseUp.bind(this)}
                                        onMouseOut={this.onMouseOut.bind(this)}
                                        ref="canvas"/>
                            </div>
                            <div className="tools-group">
                                <div className="btn-toolbar" role="toolbar">
                                    <div className="btn-group" role="group">
                                        <button onClick={this.recognize.bind(this)}
                                                className="btn btn-success">Recognize
                                        </button>
                                    </div>
                                    <div className="btn-group" role="group">
                                        <button onClick={this.clear.bind(this)} className="btn btn-danger">Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="col-md-12 paint-region">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
