import * as T from '../../vendor/three.module.js';

/** Arc-length table: the 120 Hz simulation never re-evaluates spline polynomials. */
export function bakeRoute(curve,spacing=.16){
  const length=curve.getLength(),count=Math.max(128,Math.ceil(length/spacing));
  const points=new Float32Array((count+1)*3),tangents=new Float32Array((count+1)*3),scratch=new T.Vector3();
  for(let i=0;i<=count;i++){
    curve.getPointAt(i/count,scratch).toArray(points,i*3);
    curve.getTangentAt(i/count,scratch).toArray(tangents,i*3);
  }
  function sample(table,phase,result){
    const at=((phase%1+1)%1)*count,index=Math.floor(at),f=at-index,a=index*3,b=a+3;
    return result.set(table[a]+(table[b]-table[a])*f,table[a+1]+(table[b+1]-table[a+1])*f,table[a+2]+(table[b+2]-table[a+2])*f);
  }
  return {isBakedRoute:true,getLength:()=>length,
    getPointAt:(phase,result=new T.Vector3())=>sample(points,phase,result),
    getTangentAt:(phase,result=new T.Vector3())=>sample(tangents,phase,result).normalize()};
}
