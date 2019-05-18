import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import 'bootstrap/dist/css/bootstrap.css';
import M from 'materialize-css'
import { Form, Button, Modal } from 'react-bootstrap';
import Video from "twilio-video";
import "../App.css"
import axios from "axios"
import socketIO from 'socket.io-client';






class nameList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newusername: this.props.data.username,
            newtoken: '',
            show: '',

            newcaller: '',
            newcalled: ''

        }
        this.activeRoom = null;
        this.previewTracks = null;
        this.identity = null;
        this.roomName = 'Launchpad';

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.roomJoined = this.roomJoined.bind(this);


    }
    handleClose() {
        this.setState({ show: false });
        console.log(this.activeRoom)
        if (this.activeRoom) {
            this.activeRoom.disconnect();

        }
        console.log("Closed")
    }






    handleShow() {
        this.props.callApi()
        var self = this
        this.setState({ show: true });
        var localTracksPromise = this.previewTracks
            ? Promise.resolve(this.previewTracks)
            : Video.createLocalTracks();
        localTracksPromise.then(
            (tracks) => {
                window.previewTracks = this.previewTracks = tracks;
                var previewContainer = document.getElementById("local-media");
                if (!previewContainer.querySelector("video") && !self.state.show) {
                    this.attachTracks(tracks, previewContainer);
                }

            },
            (error) => {
                console.log(error)
            }
        );
        let connectOptions = {
            name: this.roomName
        };
        if (this.state.previewTracks) {
            connectOptions.tracks = this.state.previewTracks;
        }
        Video.connect(this.state.newtoken, connectOptions).then(this.roomJoined, error => {
            alert('Could not connect to Twilio: ' + error.message);
        });




    }
    componentWillMount() {
        var self = this
        var socket = socketIO("http://localhost:3000");
        socket.on("Data2", function (data, err) {
            if (data) {
                console.log('check 2', socket.connected);
                self.setState({ newcalled: data });
                console.log(self.state.newcalled)
            }
            else {
                console.log("No Connection")
            }
        })

    }
    componentDidMount() {


        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems, { opacity: 1 });
        var self = this;
        axios.post('https://liveup.mybluemix.net/token', {
            username: self.state.newusername
        })
            .then(function (response) {

                self.setState({ newtoken: response.data });
                console.log(self.state.newtoken)

            }).catch(function (error) {
                console.log(error);
            })


        // axios.get('https://liveup.mybluemix.net/token').then(results => {
        //     this.setState({ newtoken: results.data });
        // });
    }



    attachTracks(tracks, container) {
        tracks.forEach(track => {
            container.appendChild(track.attach());
        });
    }
    attachParticipantTracks(participant, container) {
        console.log(participant)
        var tracks = Array.from(participant.tracks.values());
        this.attachTracks(tracks, container);
    }

    detachParticipantTracks(participant) {
        var tracks = Array.from(participant.tracks.values());
        tracks.forEach(track => {
            track.detach().forEach(detachedElement => {
                detachedElement.remove();
            });
        })

    }
    isArrayEmpty(array) {
        return !Array.isArray(array) || !array.length
    }
    roomJoined(room) {
        console.log(room)
        this.activeRoom = room;
        window.room = room.name;
        // Called when a participant joins a room

        if (this.refs.localMedia) {
            var previewContainer = this.refs.localMedia
            if (!previewContainer.querySelector("video")) {
                this.attachParticipantTracks(room.localParticipant, previewContainer);
            }
            room.participants.forEach(participant => {
                console.log("Already in Room: '" + participant.identity + "'");
                var previewContainer = this.refs.remoteMedia;
                this.attachParticipantTracks(participant, previewContainer);
            });
            room.on('participantConnected', participant => {
                console.log("Joining: '" + participant.identity + "'");
            });

            room.on('trackAdded', (track, participant) => {
                var previewContainer = this.refs.remoteMedia;
                this.attachTracks([track], previewContainer);
            });



            room.on('participantDisconnected', participant => {
                console.log("Participant '" + participant.identity + "' left the room");
                this.detachParticipantTracks(participant);
            });

            room.on('disconnected', () => {
                if (this.previewTracks) {
                    this.previewTracks.forEach(track => {
                        track.stop();
                    });
                }
                this.detachParticipantTracks(room.localParticipant);
                room.participants.forEach(this.detachParticipantTracks);
                this.activeRoom = null;
                this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
            });
        }



    }




    render() {
        let userMessage;
        if (this.state.show === true) {
            console.log("Opened")
            userMessage = (
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Body>
                        <div id="remote-media"></div>
                        <div id="controls">
                            <div id="preview">
                                <div ref="localMedia" id="local-media" className="myvideo"></div>
                                <div className="flex-item" ref="remoteMedia" id="remote-media" className="myvideo" />
                            </div>
                        </div>
                    </Modal.Body>
                    <Button variant="secondary" onClick={this.handleClose}>Close
                    </Button>
                </Modal>
            )
        }
        return (

            <div>

                <div className="row">
                    <div className="col s12 m3">
                        <div className="card">
                            <div className="card-content">
                                <p>{this.props.data.username}</p>
                            </div>
                            <Form className="col-lg-12">
                                <Button variant="primary" onClick={this.handleShow}  >
                                    JOIN
                                </Button>
                            </Form>
                        </div>
                        <div>
                            {userMessage}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default nameList;