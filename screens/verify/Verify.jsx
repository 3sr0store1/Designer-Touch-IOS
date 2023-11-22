import {useState, useRef,useEffect} from "react";
import { Text, View, TextInput, Pressable } from "react-native";
import style from "./style.module.css";
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from "react-redux";
import {verify} from "../../store/signSlice";

const Verify = () => {

  const dispatch=useDispatch() ;
  const ref0=useRef("")
  const ref1=useRef("")
  const ref2=useRef("")
  const ref3=useRef("")
  const ref4=useRef("")
  const [v0, set0]=useState("")
  const [v1, set1]=useState("")
  const [v2, set2]=useState("")
  const [v3, set3]=useState("")
  const [v4, set4]=useState("")
  const change=(index,n)=>{
    const refs=[ref0,ref1,ref2,ref3,ref4]
    if(n.length>0 && index<4)
      refs[index+1].current.focus()
  }  
  const shadow={
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
  style.input={...style.input,...shadow}
  style.button={...style.button,...shadow}
  const submit=()=>{
    const code=v0+v1+v2+v3+v4
    dispatch(verify(code))
  }
  return (
    <View style={style.page}>
        <Text style={style.title} >ادخل الرمز</Text>
        <Text style={style.text} >تم ارسال الرمز المكون من 5 ارقام الى بريدك الالكترونى</Text>
        <View style={style.inputs} >
          <TextInput
            style={style.input}
            onChangeText={(n)=>{set0(n);change(0, n)}}
            value={v0}
            inputmode="numeric"
            placeholderTextColor="#999999"
            textAlign="center"
            maxLength={1}
            keyboardType="numeric"
            autoFocus
            ref={ref0}
          />
          <TextInput
            style={style.input}
            onChangeText={(n)=>{set1(n);change(1, n)}}
            value={v1}
            inputmode="numeric"
            placeholderTextColor="#999999"
            textAlign="center"
            maxLength={1}
            keyboardType="numeric"
            ref={ref1}
          />
          <TextInput
            style={style.input}
            onChangeText={(n)=>{set2(n);change(2, n)}}
            value={v2}
            inputmode="numeric"
            placeholderTextColor="#999999"
            textAlign="center"
            maxLength={1}
            keyboardType="numeric"
            ref={ref2}
          />
          <TextInput
            style={style.input}
            onChangeText={(n)=>{set3(n);change(3, n)}}
            value={v3}
            inputmode="numeric"
            placeholderTextColor="#999999"
            textAlign="center"
            maxLength={1}
            keyboardType="numeric"
            ref={ref3}
          />
          <TextInput
            style={style.input}
            onChangeText={(n)=>{set4(n);change(4, n)}}
            value={v4}
            inputmode="numeric"
            placeholderTextColor="#999999"
            textAlign="center"
            maxLength={1}
            keyboardType="numeric"
            ref={ref4}
          />
        </View>
        <LinearGradient
          colors={["#037ca6", "#0ab2d0"]}
          start={{ x: 0, y: 1 }}
          locations={[0.2, 0.8]}
          style={style.button}
        >
          <Pressable onPress={submit}>
            <Text style={style.submit}>ارسال الرمز</Text>
          </Pressable>
        </LinearGradient>
    </View>
  );
};

export default Verify;
