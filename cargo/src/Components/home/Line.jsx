import { useContext } from 'react';
import Home from '../../Contexts/Home';



function Line({ box }) {

    const { setBoxes, filterOn, filterWhat } = useContext(Home);

  

   

    const filter = () => {
        if (filterOn.current){
            setBoxes(b => b.map(bo => ({...bo, show: true})));
            filterWhat.current = null;
        } else {
            setBoxes(b => b.map(bo => bo.container_id === box.container_id ? {...bo, show: true} : {...bo, show: false}));
            console.log(box.container_id)
            filterWhat.current = box.container_id;
        }
        filterOn.current = !filterOn.current;
    }

    return (
        <li className="list-group-item">
            <div className="home">
                <div className="home__content__cat click-link" onClick={filter}>
                        Container Number: {box.containerNumber}
                </div>
                <div className="home__content__cat">
                        Container Size: {box.containerSize}
                </div>
                <div className="home__content">
                    <div className="home__content__info">
                        <h2>{box.title}</h2>
                        {box.image ? <div className='img-bin'>
                            <img src={box.image} alt={box.title}>
                            </img>
                        </div> : null}
                    </div>
                    <div className="home__content__price">
                        {box.weight} kg
                    </div>
                    

                    

                    
                </div>
            </div>
        </li>
    )
}

export default Line;