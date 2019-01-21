/* global firebase */
$(document).ready(function () {
    console.log("start");
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyA07r26rUaxW497jgkFXNofa6-XnKpihDg",
        authDomain: "test-f9914.firebaseapp.com",
        databaseURL: "https://test-f9914.firebaseio.com",
        projectId: "test-f9914",
        storageBucket: "test-f9914.appspot.com",
        messagingSenderId: "108599366094"
    };
    firebase.initializeApp(config);
    // Create a variable to reference the database
    var database = firebase.database();
    console.log(database);
    var TrainName;
    var Destination;
    var firstTrain;
    var Frequency;
    var MFormat = "HH:mm";
    var MinsTillTrain;
    var nextTrain;
    var TrainArrival;


    function trainCal() {

        console.log("trainCal Start");
        // firstTrain pushed back 1 year
        var firstTrainConverted = moment(firstTrain, MFormat).subtract(1, "years");
        console.log(firstTrainConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format(MFormat));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
        console.log("DIFFERENCE IN TIME FROM firstTrainConverted: " + diffTime);

        // // Time apart (remainder)
        var Remainder = diffTime % Frequency;
        console.log(Remainder);

        // Minute Until Train
        MinsTillTrain = Frequency - Remainder;
        console.log("MINUTES TILL TRAIN: " + MinsTillTrain);

        // Next Train
        nextTrain = moment().add(MinsTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format(MFormat));
        TrainArrival = moment(nextTrain).format(MFormat);
    }


    database.ref().on("value", function (snapshot) {
        console.log("database start");

        console.log(snapshot.val());
        console.log(snapshot.child());
        console.log(snapshot.numChildren());


        if (snapshot.numChildren() === 0) {
            console.log("true");
            $('.table').hide();

        } else {
            $('.table').show()
        }



    });

    // This callback keeps the page updated when a value changes in firebase.
    database.ref().on("child_added", function (snapshot) {


        // Console.log the "snapshot" value (a point-in-time representation of the database)
        console.log(snapshot.val());

        // Change the value of our vars to match the value in the database
        TrainName = snapshot.val().TrainName;
        Destination = snapshot.val().Destination;

        TrainArrival = snapshot.val().TrainArrival;
        MinsTillTrain = snapshot.val().MinsTillTrain;


        firstTrain = snapshot.val().firstTrain;
        Frequency = snapshot.val().Frequency;
        trainCal();
        console.log(TrainName);
        console.log(Destination);
        console.log(firstTrain);
        console.log(Frequency);

        var toptable = $(".tableInfo");
        var table = $("<tr>");



        table.append('<td>' + TrainName);
        table.append('<td>' + Destination);
        table.append('<td>' + Frequency);
        table.append('<td>' + TrainArrival);
        table.append('<td>' + MinsTillTrain);

        toptable.prepend(table);


        // If any errors are experienced, log them to console.
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    // --------------------------------------------------------------

    // Whenever a user clicks the click button
    $(".btn ").on("click", function () {
        event.preventDefault();

        TrainName = $("#TrainName").val();
        Destination = $("#Destination").val();
        firstTrain = $("#firstTrain").val();
        Frequency = $("#Frequency").val();
        if (TrainName !== "" && Destination !== "" && firstTrain !== "" && Frequency !== "") {

            console.log(TrainName);
            console.log(Destination);
            console.log(firstTrain);
            console.log(Frequency);



            trainCal();
            // Save new value to Firebase
            database.ref().push({
                TrainName: TrainName,
                Destination: Destination,
                firstTrain: firstTrain,
                Frequency: Frequency,
                TrainArrival: TrainArrival,
                MinsTillTrain: MinsTillTrain,
                dateAdded: firebase.database.ServerValue.TIMESTAMP


            });

            // console.Logs the values
        }

    });
});