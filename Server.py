import time
import argparse
import pandas as pd
from flask import Flask
from flask_socketio import SocketIO

broadcasting = False
SOCKET_NAMESPACE = '/broadcast'
client_count = 0
data = pd.read_csv('data.csv')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app, cors_allowed_origins='*')


def broadcast_data(time_unit: int = 1):
    # This function is running in the background since the first client is connected. Data are sent according to their
    # time column, the value inside the time column represent the seconds after the first client is connected, the unit
    # of the time value can be adjusted in the time_unit parameter, default is 1 second. All clients will receive the
    # same data at the same time, late join clients will not receive previous data, when all data are sent, it will
    # return to the beginning and broadcast the data all over again.
    #
    # If all clients are disconnected, the index parameter of the data will be reset, so the broadcasting will start
    # from the beginning next time.

    time_index = 0
    start_time = time.time()
    global client_count
    global data

    while 1:
        if not client_count:
            time_index = 0
            # Slow down the loop
            socketio.sleep(time_unit - (time.time() - start_time) % time_unit)
            continue
        # Broadcast data to all clients
        socketio.emit('serverResponse', data[data['Time'] == time_index].to_json(orient='records'),
                      namespace=SOCKET_NAMESPACE)
        # Make sure it loops back to the beginning
        time_index = (time_index + 1) % (max(data['Time']) + 1)
        # Broadcast every second (or other unit)
        socketio.sleep(time_unit - (time.time() - start_time) % time_unit)

@socketio.on('connect', namespace=SOCKET_NAMESPACE)
def on_connect():
    # This is triggered when a client is connected to the server, if it is the first client, the broadcasting will
    # start now
    print('Connected server!')
    global client_count
    global broadcasting
    # Keep count on number of clients
    client_count += 1
    if not broadcasting:
        broadcasting = True
        socketio.start_background_task(target=lambda: broadcast_data())


@socketio.on('disconnect', namespace=SOCKET_NAMESPACE)
def on_disconnect():
    # This is triggered when a client is disconnected from the server
    print('Disconnected server!')
    # Keep count on number of clients
    global client_count
    client_count -= 1


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--port', type=int, default=8082, help='Listening port for the server')
    args = parser.parse_args()
    port = args.port

    socketio.run(app, port=port, debug=True)


if __name__ == '__main__':
    main()
