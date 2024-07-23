import React, { useEffect } from 'react'
import "./DailyCouleeList.css"
import CouleeDisplay from '../CouleeDisplay/CouleeDisplay'


export function timeToSeconds(time) {
  if(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
}

//Composant pour afficher la liste des coulées produites aujourd'hui ainsi que les blocs à l'intérieur
export default function DailyCouleeList(props) {
  const couleesTries = [...props.couleesDuJour];
  couleesTries.sort((a,b) => {
      return timeToSeconds(a.startTime) - timeToSeconds(b.startTime);
  });

  useEffect(() => {
    console.log(couleesTries);
  },[couleesTries])
    return (
      <div className='daily-coulee-list'>
        <h2>Liste des coulées</h2>
        <div className='list-coulee-display'>
          {
            couleesTries.length > 0 && 
            couleesTries.map((coulee) => ( (coulee.numero || coulee.nom) && 
              <CouleeDisplay 
                key={coulee.id}
                coulee = {coulee}  />
            ))}
        </div>
        
      </div>
    )
}
