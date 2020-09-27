import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import React, { useCallback, useState } from 'react';
import TUICalendar from '@toast-ui/react-calendar';

var groupID = "";
var meetingName = "";


function Calendar(props) {

    const handle = useCallback(() => props.logout(false), [props]);

    const [calendars] = useState([{
        id: "1",
        name: "My Calendar",
        color: "#ffffff",
        bgColor: "#9e5fff",
        dragBgColor: "#9e5fff",
        borderColor: "#9e5fff"
    }]);

    const onBeforeDeleteSchedule = useCallback(result => {
        console.log(result);

        const { id, calendarId } = result.schedule;

        calendars.current.calendarInst.deleteSchedule(id, calendarId);
    }, [calendars]);

    const onBeforeUpdateSchedule = useCallback(e => {
        console.log(e);

        const { schedule, changes } = e;

        calendars.current.calendarInst.updateSchedule(
            schedule.id,
            schedule.calendarId,
            changes
        );
    }, [calendars]);

    const onBeforeCreateSchedule = useCallback((scheduleData) => {

        //send to api
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('PUT', 'http://localhost:8080/api/update', false);
        xmlhttp.send(JSON.stringify({"start" : scheduleData.start, "end" : scheduleData.end,  "groupid" : groupID, "name" : scheduleData.title}));

        const schedule = {
            id: String(Math.random()),
            title: scheduleData.title,
            isAllDay: scheduleData.isAllDay,
            start: scheduleData.start,
            end: scheduleData.end,
            category: scheduleData.isAllDay ? "allday" : "time",
            dueDateClass: "",
            location: scheduleData.location,
            raw: {
                class: scheduleData.raw["class"]
            },
            state: scheduleData.state
        };

        calendars.current.calendarInst.createSchedules([schedule]);
    }, [calendars]);


    return (
        <>
            <Button onClick={handle} variant="dark">log out</Button><SelectUser />{meetingName}
            <TUICalendar

                ref={calendars}
                height="1000px"
                view="week"
                useCreationPopup={true}
                useDetailPopup={true}
                calendars={calendars}
                onBeforeCreateSchedule={onBeforeCreateSchedule}
                onBeforeDeleteSchedule={onBeforeDeleteSchedule}
                onBeforeUpdateSchedule={onBeforeUpdateSchedule}

            />
        </>
    );
}

function SelectUser() {
    const [show, setShow] = useState(false);

    const handleClose = useCallback(() => setShow(false), [setShow]);
    const handleShow = useCallback(() => setShow(true), [setShow]);

    return (
        <>
            <Button variant="dark" onClick={handleShow}>
                Select User
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select User</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {
                        //todo: fetch list of users and display them as button list items in unordered list
                    }

                    <Button variant="dark">User 1</Button><br />
                    <Button variant="dark">User 2</Button><br />
                    <Button variant="dark">User 3</Button><br />
                    OR
                    <Form>
                        <Form.Group controlId="formBasicName">
                            <Form.Control type="email" placeholder="Name" />
                        </Form.Group>
                    </Form>
                    <Button variant="dark">Submit</Button><br />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


function Login(props) {
    const handle = useCallback(() => props.login(true), [props]);

    const handleCreate = useCallback(event => {

        event.preventDefault();
        meetingName = event.target.elements.groupName.value;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                groupID = xmlhttp.responseText;
            }
        };
        xmlhttp.open('POST', 'http://localhost:8080/api/create', false);
        xmlhttp.send(JSON.stringify({ "groupname": meetingName}));

        handle();
    }, [handle]);

    const handleJoin = useCallback(event => {
        event.preventDefault();
        console.log(event.target.elements.groupID.value)
        handle();
    }, [handle]);

    return (
        <div className="container text-center">
            <div className="col-lg-4 col-lg-offset-4">
                <div>
                    <Form onSubmit={handleCreate}>
                        <Form.Group controlId="groupName" >
                            <Form.Control size="md" type="text" placeholder="Meeting Name" style={{ textAlign: "center" }} />
                            <Button type="submit" variant="dark">Create Calendar</Button>
                        </Form.Group>
                    </Form>
                    OR
                    <Form onSubmit={handleJoin}>
                        <Form.Group controlId="groupID" >
                            <Form.Control size="md" type="text" placeholder="Code" style={{ textAlign: "center" }} />
                            <Button type="submit" variant="dark">Join Calendar</Button>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </div>
    );
}

function App() {
    //hooks go here
    const [calendarLoaded, setCalendarLoaded] = useState(false);
    useCallback(() => setCalendarLoaded(!calendarLoaded), [calendarLoaded, setCalendarLoaded]);
    return calendarLoaded ? <Calendar logout={setCalendarLoaded} /> : <Login login={setCalendarLoaded} />;
}

export default App;
