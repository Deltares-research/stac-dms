import{_ as c}from"./VmqREnFO.js";import{m as n,r,u as l,o as p,c as y,b as u,q as d}from"./31PJL3iA.js";import"./C52_cgDU.js";import"./BJTLxclH.js";import"./CbCMFK9A.js";import"./Ci65v0pw.js";import"./CFwNVicP.js";import"./D496V5Yy.js";import"./CQNklV-G.js";import"./AbVsqMK9.js";import"./BbUVoc-8.js";const m={class:"justify-end"},$=n({__name:"create",setup(_){const e=r(""),{$api:s}=l();r(""),r("");async function i(t){const o={type:"Collection",stac_version:"1.0.0",id:t.title,title:t.title,description:t.description,keywords:[t.collectionType],license:"proprietary",extent:{spatial:{bbox:[[-180,-56,180,83]]},temporal:{interval:[[]]}},links:[]};t.keywordsFacility!=="No keywords"&&o.links.push({rel:"keywords",href:"/facilities/"+t.keywordsFacility,type:"application/json",id:t.keywordsFacility});try{e.value="";const a=await s("/collections",{method:"POST",body:o})}catch{e.value="It was not possible to create the collection";return}d().push("/collections")}return(t,o)=>(p(),y("div",m,[u(c,{"button-title":"Create","card-title":"Create a new collection",onUpdate:i,errors:e.value,collectionType:"experimentalFacility",keywordFacility:"No keywords"},null,8,["errors"])]))}});export{$ as default};
