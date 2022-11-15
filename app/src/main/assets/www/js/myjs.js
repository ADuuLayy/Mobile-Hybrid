
function onBodyLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    successDB();
}

function rentalStoreDB()
{
        var db=window.openDatabase("rentalDB","1.0","Rental DB",1000000);
        db.transaction(rentalTesting,errorDB,successDB);
}
function rentalTesting(tx)
{
    tx.executeSql("select * from rental where p_type = ? AND bed_no = ? AND bath_no = ? AND date = ? AND time = ? AND m_rent = ? AND f_type = ? AND note = ? AND rname =?",[$("#p_type").val(),$("#bed_no").val(),$("#bath_no").val(), $("#date").val(),$("#time").val(),$("#m_rent").val(),$("#f_type").val(),$("#note").val(),$("#rname").val()],Rental,errorDB);
}
function Rental(tx, results)
{
    var len=results.rows.length;
    if(len <= 0)
    {
        var db = window.openDatabase("rentalDB","1.0","Rental DB",1000000);
            db.transaction(addRental,errorDB);
    }
    else
    {
        alert("You already input this Rental Apartment");
    }
}
function addRental()
{
        var p_type = $("#p_type").val();
        var bed_no = $("#bed_no").val();
        var bath_no = $("#bath_no").val();
        var date = $("#date").val();
        var time = $("#time").val();
        var m_rent = $("#m_rent").val();
        var m_rentPattern = /^\d{4}$/;
        var f_type = $("#f_type").val();
        var rname = $("#rname").val();
        var rnamePattern = /^[A-Z a-z]+$/;
        if(date != "" && time != "" && m_rent != "" && rname != "")
        {
            if(m_rentPattern.test(m_rent) && rnamePattern.test(rname))
                {
                    var db=window.openDatabase("rentalDB","1.0","Rental DB",1000000);
                    db.transaction(addDataSuccess,errorDB,successDB);
                }
            else if(m_rentPattern.test(m_rent))
                {
                    alert("Reporter Name can't be entered number");
                }
            else if(rnamePattern.test(rname))
                {
                    alert("Monthly Rent must be 4 Digits Numbers");
                }
            else
                {
                    alert("Monthly Rent must be 4 Digits Numbers and Reporter Name can't be entered number")
                }
        }
        else
                {
                    alert("Make sure Date and Time and Monthly Rent and Reporter Name are filled");
                }
     }

function addDataSuccess()
{
    if(confirm("Are sure you want to add data"))
    {
        var db=window.openDatabase("rentalDB","1.0","Rental DB",1000000);
        db.transaction(storeRental,errorDB);
    }
    else
    {
        alert("Data didn't add");
    }
}
function storeRental(tx)
{
     alert("Successfully Added");
    tx.executeSql("create table if not exists rental(PTid integer primary key autoincrement,p_type varchar,bed_no integer,bath_no integer,date date,time time,m_rent integer,f_type varchar,note varchar,rname varchar)");
    tx.executeSql("insert into rental(p_type,bed_no,bath_no,date,time,m_rent,f_type,note,rname) values(?,?,?,?,?,?,?,?,?)",[$("#p_type").val(),$("#bed_no").val(),$("#bath_no").val(),$("#date").val(),$("#time").val(),$("#m_rent").val(),$("#f_type").val(),$("#note").val(),$("#rname").val(),]);
    window.location=('index.html');
}
function errorDB(err)
{
    alert("Error Message: "+err.message);
}
function successDB()
{
    var db=window.openDatabase("rentalDB","1.0","Rental DB",1000000);
    db.transaction(queryRental,errorDB);
}
function queryRental(tx)
{
    tx.executeSql("select * from rental",[],querySuccess,errorDB);
}
function querySuccess(tx, results)
{
     var len=results.rows.length;
     var st="";
     for(var i=0;i<len;i++)
     {
        st += "No: "+(i+1)+"&nbsp;&nbsp;&nbsp;";
        st += "|  ID: "+results.rows.item(i).PTid+" ";
        st += "|  Property Type: "+results.  rows.item(i).p_type+"<br/>";
        st += "Bedroom Number: "+results.rows.item(i).bed_no+"&nbsp;&nbsp;&nbsp;";
        st += "|  Bathroom Number: "+results.rows.item(i).bath_no+"<br/>";
        st += "Date: "+results.rows.item(i).date+"&nbsp;&nbsp;&nbsp;";
        st += "|  Time: "+results.rows.item(i).time+"<br/>";
        st += "Monthly Rent: "+results.rows.item(i).m_rent+"<br/>";
        st += "Furniture Type: "+results.rows.item(i).f_type+"<br/>";
        st += "Note :"+results.rows.item(i).note+"<br/>";
        st += "Reporter Name: "+results.rows.item(i).rname+"<hr/>";
        st += "<input type='button' id='"+results.rows.item(i).PTid+"' value='Delete' onclick='deleteRental(this.id)'/>&nbsp;&nbsp;&nbsp;";
        st += "<input type='button' id='"+results.rows.item(i).PTid+"' value='Update' onclick='updateRental(this.id)'/>";
        st += "<hr/>";
     }
     $("#rentalInfo").html("All Rental Apartment: <br/>"+st);
}
function deleteRental(clicked_id)
{
    //alert("Clicked id: "+clicked_id);
    if(confirm("Are you sure you want to delete?"))
     {
        var delete_PTid=clicked_id;
        window.localStorage.setItem("delete_PTid",delete_PTid);

        var db=window.openDatabase("rentalDB","1.0","Rental DB",1000000);
        db.transaction(deleteRentalDB,errorDB);
     }
}
function deleteRentalDB(tx)
{
    var delete_PTid=0;
    delete_PTid=window.localStorage.getItem("delete_PTid");
    window.localStorage.clear();

    tx.executeSql("delete from rental where PTid=?",[delete_PTid],successDelete,errorDB);
}
function successDelete()
{
    alert("Successfully deleted!!");
    successDB();
}
function updateRental(clicked_id)
{
    //alert("Clicked id: "+clicked_id);
    var edit_PTid=clicked_id;
    window.localStorage.setItem("edit_PTid",edit_PTid);

    var db=window.openDatabase("rentalDB","1.0","Rental DB",1000000);
    db.transaction(goUpdatePage,errorDB);
}
function goUpdatePage()
{
    window.location="UpdateRental.html";
}
function showDetail()
{
    var edit_PTid=0;
    $("#PTid").val(window.localStorage.getItem("edit_PTid"));
    window.localStorage.clear();
    openDB();
}
function openDB()
{
    var db=window.openDatabase("rentalDB","1.0","Rental DB",1000000);
    db.transaction(updateRentalQuery,errorDB);
}
function updateRentalQuery(tx)
{
    tx.executeSql("select * from rental where PTid=?",
                   [$("#PTid").val()],queryResultToUpdate, errorDB);
}

function queryResultToUpdate(tx, results)
{
    var PTid=results.rows.item(0).PTid;
    var p_type=results.rows.item(0).p_type;
    var bed_no=results.rows.item(0).bed_no;
    var bath_no=results.rows.item(0).bath_no;
    var date=results.rows.item(0).date;
    var time=results.rows.item(0).time;
    var m_rent=results.rows.item(0).m_rent;
    var f_type=results.rows.item(0).f_type;
    var note=results.rows.item(0).note;
    var rname=results.rows.item(0).rname;

    $("#PTid").val(PTid);
    $("#p_type").val(p_type);
    $("#bed_no").val(bed_no);
    $("#bath_no").val(bath_no);
    $("#date").val(date);
    $("#time").val(time);
    $("#m_rent").val(m_rent);
    $("#f_type").val(f_type);
    $("#note").val(note);
    $("#rname").val(rname);

}
function updateRentalDB()
{
    var m_rent = $("#m_rent").val();
                var m_rentPattern = /^\d{4}$/;
                var rname = $("#rname").val();
                var rnamePattern = /^[A-Z a-z]+$/;

                if(m_rentPattern.test(m_rent) && rnamePattern.test(rname))
                                {
                                    var db=window.openDatabase("rentalDB","1.0","Rental DB",1000000);
                                    db.transaction(updateConfirm,errorDB,successDB);
                                }
                            else if(m_rentPattern.test(m_rent))
                                {
                                    alert("Reporter Name can't be entered number");
                                }
                            else if(rnamePattern.test(rname))
                                {
                                    alert("Monthly Rent must be 4 Digits Numbers");
                                }
                            else
                                {
                                    alert("Monthly Rent must be 4 Digits Numbers and Reporter Name can't be entered number")
                                }

}
function updateConfirm()
{
        if(confirm("Are you sure you want to update?"))
        {
            var db=window.openDatabase("rentalDB","1.0","Rental DB",1000000);
            db.transaction(updateRentalAction,errorDB);
        }
}
function updateRentalAction(tx)
{
    tx.executeSql("update rental set p_type=?, bed_no=?, bath_no=?, date=?, time=?, m_rent=?, f_type=?, note=?, rname=? where PTid=?",
                  [$("#p_type").val(),$("#bed_no").val(),$("#bath_no").val(),$("#date").val(),$("#time").val(),$("#m_rent").val(),$("#f_type").val(),$("#note").val(),$("#rname").val(),$("#PTid").val()],
                  successUpdate,errorDB);
}
function successUpdate()
{
    alert("Successfully updated!!");
    successDB();
    window.location='RentalResult.html';
}

function searchPropertyTypeDB()
{
    var db=window.openDatabase("rentalDB","1.0","Rental DB",1000000);
    db.transaction(querySearchRental1,errorDB);
}
function querySearchRental1(tx)
{
    tx.executeSql("select * from rental where p_type=?",[$("#p_type1").val()],querySearchSuccess,errorDB);
}
function searchMonthlyRentDB()
{
    var db=window.openDatabase("rentalDB","1.0","Rental DB",1000000);
    db.transaction(querySearchRental2,errorDB);
}
function querySearchRental2(tx)
{
    tx.executeSql("select * from rental where m_rent>=?",[$("#m_rent1").val()],querySearchSuccess,errorDB);
}
function searchReporterNameDB()
{
    var db=window.openDatabase("rentalDB","1.0","Rental DB",1000000);
    db.transaction(querySearchRental3,errorDB);
}
function querySearchRental3(tx)
{
    tx.executeSql("select * from rental where rname=?",[$("#rname1").val()],querySearchSuccess,errorDB);
}
function querySearchSuccess(tx, results)
{
    var len=results.rows.length;
    var st="";
    for(var i=0;i<len;i++)
    {
        st += "ID: "+results.rows.item(i).PTid+" ";
        st += "|  Property Type: "+results.rows.item(i).p_type+"<br/>";
        st += "Bedroom Number: "+results.rows.item(i).bed_no+"&nbsp;&nbsp;&nbsp;";
        st += "|  Bathroom Number: "+results.rows.item(i).bath_no+"<br/>";
        st += "Date: "+results.rows.item(i).date+"&nbsp;&nbsp;&nbsp;";
        st += "|  Time: "+results.rows.item(i).time+"<br/>";
        st += "Monthly Rent: "+results.rows.item(i).m_rent+"<br/>";
        st += "Furniture Type: "+results.rows.item(i).f_type+"<br/>";
        st += "Note :"+results.rows.item(i).note+"<br/>";
        st += "Reporter Name: "+results.rows.item(i).rname+"<hr/>";
    }
    if(len==0)$("#rentalInfo1").html("<h3>No Rental Apartment for your searched </h3><br/>");
    else $("#rentalInfo1").html("<br/><h3>Searched Rental Apartment: </h3><br/>"+st);
}
