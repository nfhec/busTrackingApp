<?php
$conn = mysqli_connect('localhost', 'root', 'root', 'gtfs');
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}
date_default_timezone_set('America/Fort_Collins');
$dayName = strtolower(date('l'));

$routeShortName = $_POST['route'];

//get the route id from the route short names
$query = "SELECT route_id FROM routes WHERE route_short_name LIKE ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $routeShortName);
$stmt->execute();
$result = $stmt->get_result();
$route_id = 0;

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $routeId = $row['route_id'];
    }
}
//find trips for chosen route
$query = "SELECT trips.trip_id
FROM trips
WHERE trips.service_id IN(
    SELECT calendar.service_id
    FROM calendar
    WHERE CURRENT_DATE BETWEEN calendar.start_date and calendar.end_date AND calendar.$dayName LIKE 1
) 
AND trips.route_id LIKE ?";

$stmt = $conn->prepare($query);
$currentDay = "calendar.$day";
$stmt->bind_param('i', $routeId)   ;
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;


    }
}
echo (json_encode($data));