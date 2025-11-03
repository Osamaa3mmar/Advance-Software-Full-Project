import { useParams } from 'react-router-dom'
import InvaliedRoomId from '../../../Components/Rooms/Room/InvaliedRoomId';
import Room from './Room';

export default function RoomCheck() {
    const {id}=useParams();

    if(id<=0){
        return <InvaliedRoomId/>;
    }
    else
  return (
    <Room/>    
  )
}
