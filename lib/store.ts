'use client';
import{useEffect,useState,useCallback}from'react';
import type{Setter}from'./types';
/** localStorage-backed state. `ready` flips true once the stored value has been loaded. */
export function useLS<T>(key:string,init:T):[T,Setter<T>,boolean]{
  const[val,setVal]=useState<T>(init),[ready,setReady]=useState(false);
  useEffect(()=>{try{const r=localStorage.getItem(key);if(r)setVal(JSON.parse(r));}catch{}setReady(true);},[key]);
  const set:Setter<T>=useCallback(v=>{setVal(p=>{const n=typeof v==='function'?(v as(p:T)=>T)(p):v;try{localStorage.setItem(key,JSON.stringify(n));}catch{}return n;});},[key]);
  return[val,set,ready];
}
