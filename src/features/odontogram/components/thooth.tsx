import Diagram from "./diagram";

interface ThoothProps {
  id: number;
  type: string;
  selectedCondition: string;
  rotate: boolean;
  openModal: () => void,
}

export default function Thooth({id, type, selectedCondition, rotate, openModal}: ThoothProps) {
    let imgFile = `src/assets/tooth-${type}.png`

    return (
        <div className="flex-1">
            {!rotate && <Diagram id={id} selectedCondition={selectedCondition} />}
            <div className="cursor-pointer" onClick={openModal}>
                <img src={`${imgFile}`} className={`${rotate ? 'rotate-180' : ''}`} />
            </div>
            {rotate && <Diagram id={id} selectedCondition={selectedCondition}/>}
            <div className="tooth-number">{id}</div>
        </div>
    )
}