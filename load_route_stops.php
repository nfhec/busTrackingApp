<?php
$conn = mysqli_connect('localhost', 'root', 'root', 'gtfs');
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}
$trip_id = $_POST['trip_id'];
$query = "SELECT stop_times.stop_id, trips.trip_id, stops.stop_name
        FROM trips
        JOIN stop_times ON trips.trip_id = stop_times.trip_id  -- Another join condition for trips
        JOIN stops ON stop_times.stop_id = stops.stop_id
        WHERE trips.trip_id LIKE ? AND trips.direction_id LIKE 1  -- Filter for specific trip
        ORDER BY stop_times.arrival_time";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $trip_id);
$stmt->execute();
$result = $stmt->get_result();
$stopsArr = [];
//array of stops for current trip
if ($result->num_rows > 0) {
    while ($r = $result->fetch_assoc()) {
        $stops[] = $r;
    }
    $stopIdIncrement = 0;
    foreach ($stops as $k => $stop_id) {
        $stopIdIncrement++;
        $stopsArr += [$stopIdIncrement => $stop_id['stop_id']];
    }

}
$newConn = mysqli_connect('localhost', 'root', 'root', 'gtfs');
$stopInfoIncrement = 0;
foreach ($stops as $p => $stopInfo) {
    //get stop info
    $query = "
        SELECT stop_times.arrival_time, stops.stop_name
        FROM stop_times
        JOIN stops ON stop_times.stop_id = stops.stop_id
        WHERE stop_times.trip_id LIKE ? AND stops.stop_id LIKE ?";
    $stopID = $stopsArr[$stopInfoIncrement + 1];
    $stmt = $newConn->prepare($query);
    $stmt->bind_param('ii', $trip_id, $stopsArr[$stopInfoIncrement + 1]);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while ($r = $result->fetch_assoc()) {
            $stop_info[] = $r;
        }

        $stopsArr[$stopInfoIncrement + 1] = ['stop_id' => $stopID, 'stop_name' => $stop_info[$stopInfoIncrement]['stop_name'], 'arrival_time' => $stop_info[$stopInfoIncrement]['arrival_time']];

    }
    $stopInfoIncrement += 1;
}


//remove duplicate trip id in JSON
$trip = [];
//add stops to trip and trip id to trip
$trip += ['stops' => $stopsArr, 'trip_id' => $trip_id];

$stops = [];
$stopsArr = [];

echo (json_encode($trip));
