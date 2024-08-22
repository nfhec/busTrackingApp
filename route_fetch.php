<?php

$conn = mysqli_connect('localhost', 'root', 'root', 'gtfs');
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}
$query = "SELECT route_short_name, route_desc FROM routes ORDER BY route_short_name ASC";
$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;

    }
}

echo(json_encode($data));



