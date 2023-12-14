<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <table>
        <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Password</th>
        </tr>
        <?php
        $conn =mysqli_connect("localhost","root","","web");
        if ($conn->connect_error){
            die("Connection Failed : ".$conn->connect_error);
        }
        
        $sql="SELECT * FROM users";
        $result = $conn-> query($sql);
        if($result->num_rows > 0){
            while($row=$result-> fetch_assoc()){
                echo "<tr><td>".$row["id"]."</td><tr>".$row["username"]."</td><tr>".$row["password"]."</td></tr>";
            }
            echo"</table>";
        }
        else{
            echo "0 result";
        }
        $conn-> close();

        ?>    
</body>
</html>