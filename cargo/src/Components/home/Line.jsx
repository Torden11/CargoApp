import { useContext } from "react";
import Home from "../../Contexts/Home";

function Line({ container }) {
//   let n = 0;
//   if (container[1][0].bid === null) {
//     n = 0;
//   } else {
//     n = container[1].length;
//   }

  // const { setBoxes, filterOn, filterWhat } = useContext(Home);

  // const filter = () => {
  //     if (filterOn.current){
  //         setBoxes(b => b.map(bo => ({...bo, show: true})));
  //         filterWhat.current = null;
  //     } else {
  //         setBoxes(b => b.map(bo => bo.container_id === box.container_id ? {...bo, show: true} : {...bo, show: false}));
  //         console.log(box.container_id)
  //         filterWhat.current = box.container_id;
  //     }
  //     filterOn.current = !filterOn.current;
  // }

  return (
    <li className="list-group-item">
      <div className="home">
        <div
          className="home__content__title click-link"
          // onClick={filter}
        >
          Container Number: {container[1][0].number}
        </div>
        <div className="home__content__title">
          Container Size: {container[1][0].size}
        </div>
        <div className="home__content">
          <ul className="list-group">
            {container[1]?.map((b) =>
              b.bid !== null ? (
                <li key={b.bid} className="home-group-item">
                  <div className="home_content_info">
                    <div>Box content: {b.title}</div>
                    <div>Box weight: {b.weight} kg</div>
                    <div>Flammable: {b.flammable}</div>
                    <div>Perishable: {b.perishable}</div>
                  </div>
                </li>
              ) : null
            )}
          </ul>
        </div>
        {/* <div className="home__content">
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
                    

                    

                    
                </div> */}
      </div>
    </li>
  );
}

export default Line;
