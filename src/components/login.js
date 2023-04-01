import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Login() {

    
    const [code,setCode] = useState()
    const [mobile , setNumber] = useState()
    const [err , setErr] = useState()
    const [loginForm, setLoginForm] = useState(true)
    const [phoneTest, setPhoneTest] = useState(true)
    const [num , setNum] = useState()




    // Mobile Number Part -----------------------------

    const check_phone = (number) => {
        setNum(number)
      };

      useEffect(()=>{
        const regex = new RegExp("^(\\+98|0)?9\\d{9}$");
        const result = regex.test(num);
        setPhoneTest(result)
      },[mobile])

    let formIsValid = false;
    function handleValidation() {
        if(mobile === "" || mobile === undefined){
            formIsValid = false
            setErr("لطفا این قسمت را خالی نگذارید!")
        }else if(phoneTest === false){
            formIsValid = false
            setErr("شماره موبایل معتبر نیست!")
        }else{
            formIsValid = true
            setErr("")
        }
    }

  const handleSubmit = () => {
    handleValidation()
    if(formIsValid===true){
    handleRequest()
    console.log(mobile)
    localStorage.setItem("mobile" , mobile.mobile)
    }
  };

  function handleRequest(){
    axios.post( 'https://nia.megagift.ir/auth/login',mobile,{
      headers:{
        'Content-Type': 'application/json'
      }
    })
      .then(response=>{
        console.log(response.data)
        if(response.data.value.isSuccess === true){
            alert("کد با موفقیت ارسال شد")
            setLoginForm(false)
        }

      })
      .catch(error=>{
        console.log(error)
      })
      
  }


  // Authentication Code Part -----------------------------

    let smsAuth = new FormData();
    smsAuth.append('code',code);
    smsAuth.append("mobile",localStorage.getItem("mobile"))

    function handleCodeRequest(){
        axios.post( 'https://nia.megagift.ir/auth/verify',smsAuth,{
          headers:{
            'Content-Type': 'application/json'
          }
        })
          .then(response=>{
            if(response.data.value.isSuccess !== true){
                alert(response.data.value.message)
            }else{
                console.log(response.data)
            }
          })
          .catch(error=>{
            console.log(error)
          })
      }
      
      const handleCodeSubmit = () => {
        handleCodeValidation()
        if(codeIsValid===true){
        handleCodeRequest()
        console.log(smsAuth.get("code"))
        console.log(smsAuth.get("mobile"))
        }
      };

      let codeIsValid = false;
      function handleCodeValidation() {
          if(code === "" || code === undefined){
              codeIsValid = false
              setErr("لطفا این قسمت را خالی نگذارید!")
          }else{
              codeIsValid = true
              setErr("")
          }
      }

    // Countdown --------------------------

    const formatTime = (time)=>{
        let minute = Math.floor(time/60)
        let seconds = Math.floor(time - minute *60)

        if(minute <= 10) {minute = '0' + minute}
        if(seconds <= 10) {seconds = '0' + seconds}

        return minute + ":" + seconds
    }

    const[countdown,setCountdown] = useState(120)
    const[resetCode,setResetCode] = useState(false) 
    const TimerId = useRef()

    useEffect(()=>{
        TimerId.current = setInterval(() => {
            setCountdown(prev => prev - 1)
        }, 1000);
        return ()=> clearInterval(TimerId.current)
    },[])



    useEffect(()=>{
        if(countdown<=0){
            clearInterval(TimerId.current)
            setResetCode(true)
        }   
    },[countdown])



  return (
    <Container component="main" maxWidth="xs">
        {
            loginForm ?
            <Box
            sx={{
              height:"40vh",
              border:"1px solid gray",
              borderRadius:"7px",
              padding:"17px",
              marginTop: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              direction:"rtl",
            }}
          >
            <Typography component="h1" variant="h5" sx={{marginBottom:"2rem"}} >
                عنوان
            </Typography>
            <Typography sx={{ display:"flex",alignSelf:"flex-start"}} variant="h6">
                ورود
            </Typography>
            <Typography sx={{ display:"flex",alignSelf:"flex-start"}} component="p" >
                لطفا شماره موبایل خود را وارد کنید
            </Typography>
    
              <TextField
              margin="normal"
              required
              fullWidth
              id="number"
              label="شماره تلفن همراه"
              name="number"
              autoFocus
              onChange={(e)=>{
                check_phone(e.target.value)
                setNumber({"mobile" : e.target.value})
            }}
            />
    
            <Typography sx={{ display:"flex",alignSelf:"flex-start", color:"red" }} component="p" variant="caption">
               {err}
            </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{backgroundColor:"#EF4056"}}
                onClick={(e)=>{
                    // e.preventDefault()
                    handleSubmit()
                }}
              >
                ارسال کد
              </Button>
    
          </Box>
          :
          <Box
          sx={{
            height:"40vh",
            border:"1px solid gray",
            borderRadius:"7px",
            padding:"17px",
            marginTop: 18,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            direction:"rtl",
          }}
        >
          <Typography component="h1" variant="h5" sx={{marginBottom:"2rem"}} >
              کد
          </Typography>
          <Typography sx={{ display:"flex",alignSelf:"flex-start"}} component="p" >
              لطفا کد ارسالی به شماره موبایل را وارد کنید.
          </Typography>
  
            <TextField
            margin="normal"
            required
            fullWidth
            id="code"
            label="کد"
            name="code"
            autoFocus
            onChange={(e)=>setCode(e.target.value)}
          />
  
          <Typography sx={{ display:"flex",alignSelf:"flex-start", color:"red" }} component="p" variant="caption">
             {err}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{backgroundColor:"#EF4056"}}
            onClick={(e)=>{
                //   e.preventDefault()
                handleCodeSubmit()
            }}
            >
             تایید کد
            </Button>

        {
            resetCode
            ?
            <Button
            type="submit"
            
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
            style={{backgroundColor:"#84D2F5" , borderRadius:"8px"}}
            onClick={(e)=>{
                handleRequest()
            }}
            >
            ارسال مجدد کد
            </Button>
            :
            <Typography component="p" >زمان باقی مانده : {formatTime(countdown)}</Typography>
        }
  
        </Box>

        }


    </Container>
  );
}