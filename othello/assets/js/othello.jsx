import React                                                          from 'react';
import ReactDOM                                                       from 'react-dom';
import { Stage, Layer, Rect, Text, Circle }                           from 'react-konva';
import Konva                                                          from 'konva';
import { Button, Container, Row, Col, Form, FormGroup, Input, Label } from 'reactstrap';
import Disc                                                           from './components/disc.jsx';
import Info                                                           from "./info.jsx"

export default function run_othello(root, channel) {
  ReactDOM.render(<Othello channel={channel}/>, root);
}

class Othello extends React.Component {
  constructor(props) {
    super(props);
    const channel = props.channel;

    this.state = {
      colors:[],
      players:[],
      speculators:[],
      turn: -1,
      winner: null,
      lock: true,
      images: {},
    }

    this.loadImages.bind(this);

    this.loadImages();

    channel.join()
      .receive("ok", resp => this.updateView(resp))
      .receive("error", resp => { console.log("Unable to join", resp); });



    this.updateView.bind(this);
    this.move.bind(this);
  }

  loadImages() {
    let black = '/images/black.png';
    let white = '/images/white.png';
    var images = {};
    var i = 0;
    images['black'] = new Image();
    images['black'].onload = () => {
                              if(i++ >= 1) this.setState({images: images});
                            }
    images['white'] = new Image();
    images['white'].onload = () => {
                              if(i++ >= 1) this.setState({images: images});
                            }
    images['black'].src = black;
    images['white'].src = white;

  }

  updateView(resp) {
    console.log("update state", resp);
    this.setState(resp.state);
    const players = this.state.players;
    const turn = this.state.turn

    if(window.userToken == players[turn]) {
      this.setState({lock: false});
    }
  }

  move(index, that) {
    console.log("clicked!");
    that.setState({
      lock: false, //FIXME
    });
    that.props.channel.push("move", {index: index})
          .receive("ok", resp => that.updateView(resp))
          .receive("error", resp => {
            console.log("update state", resp);
            alert("cannot move here");
            that.setState({lock: false});
          });
  }

  render() {
    // TODO
    let i = 0;
    const discs = this.state.colors.map(color => {
                                          return (<Disc
                                                    key={i}
                                                    color={color}
                                                    onClick={this.state.lock ? null : this.move}
                                                    parent={this}
                                                    index={i++}
                                                    images={this.state.images}
                                                    />);
                                        });
    return (
      <Container>
        <Row>
          <Col xs="12" lg="8">
            <Stage width={400} height={400} fill={'green'}>
              <Layer>
                {discs}
              </Layer>
            </Stage>
          </Col>
          <Col xs="12" lg="4">
            <Info />
          </Col>
        </Row>
      </Container>
    );
  }
}
