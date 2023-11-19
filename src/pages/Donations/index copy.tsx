import { ToastContainer, toast } from "react-toastify";
import { Button } from "../../components/Button";
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from "react-accessible-accordion";
import { TilesMulti } from "../../components/Tiles";
interface IDonate {
    isOpen: boolean
    donations: any
    customItems: any
    setDonations: Function
    setCustomItems: Function
    setDone: Function
  }
export function Donations({ isOpen, donations, customItems, setCustomItems, setDonations, setDone }: IDonate) {

    const notify = (t: string) => {
      console.log(t);
      toast.info(t)
    }
    const notify1 = (t: string) => {
      console.log(t);
      toast.success(t, { autoClose: 7000 })
    }
    function handleProducts(curProd: any, i: any, l: any, toast: string, qtyAdjust: number) {
      if (!curProd) return
  
      let adjust = [...donations]
      let found = false
      console.log('handleProducts', donations, adjust, i, toast, qtyAdjust)
      if (donations.length === 0 && qtyAdjust !== 0) {
        notify1("Adjust quantities using left and right mouse buttons.")
      }
      // Is this a custom product? If so just add it, otherwise check for other attributes.
      if (i > l.length - 1) {
        console.log('Custom')
      } else {
        adjust && adjust.length > 0 && adjust?.forEach((x: any, i: number, o: any) => {
          // console.log(x.prod, e)
          if (x.prod === curProd) {
  
            x.qty = x.qty + qtyAdjust;
            if (x.qty === 0) {
              o.splice(i, 1)
            }
            found = true
          }
        })
        if (!found) {
          adjust?.push({ prod: curProd, qty: 1 })
          if (toast !== '') {
            notify(toast);
          }
        }
      }
      setDonations([...adjust])
    }
  
    function handleClear(e: any) {
      console.log('handleClear')
      setDonations([])
      setCustomItems([])
    }
    function areItemsEmpty(i: any) {
      // return false if donations.length is greater than zero and there is at leaston one nonblank entry in donations array
      console.log(i, donations)
      let isTrue = true
      if (donations.length > 0) return false
      if (!i || i.length === 0) {
        isTrue = true
      } else {
        i.forEach((e: any) => {
          if (e !== undefined && e !== '') { console.log('false'); isTrue = false }
        })
      }
      return isTrue
    }
    const msg = {
      pickup: 'Pick up only if included as part of larger donation.',
      solid: 'Solid wood construction only. No particle board.',
      appl: 'Appliances must be 10 years old or new, in full working order, and not missing parts or pieces.',
      rip: 'This item must be free of rips, stains, tears, excessive wear and pet hair.',
      working: 'Must be in good working condition.',
      mirror: 'Must have a frame. We do not accept unframed or plate glass mirrors.'
    }
  
    const products = {
      Bathroom: [
        { i: 'Accessories', t: msg.pickup },
        { i: 'Bathtub', t: 'Bath tubs steel or fiberglass-No Cast Iron Sinks or Bath tubs.' },
        { i: 'Sink', t: 'Removal of faucet preferred. No chips, spider veins or deep scratches in finish.' },
        { i: 'Toilet/Bidet', t: 'Toilets 1.6 gallon or less. ' + msg.working + ' ' + msg.pickup },
        { i: 'Cabinet', t: 'Bathroom vanities no water damage, will not take counter top without cabinet.' },
        { i: 'Mirror', t: msg.mirror },
        { i: 'Organizer', t: '' },
        { i: 'Shelving', t: '' },
        { i: 'Vanity', t: 'Bathroom vanities no water damage, will not take counter top without cabinet.' },
      ],
      Bedroom: [
        { i: 'Bed', t: 'We do not accept Hospital or Sleep Number beds. Must be disassembled for pick up.' },
        { i: 'Bed Frame', t: 'Must be disassembled for pick up.' },
        { i: 'Chest', t: msg.solid },
        { i: 'Dresser', t: 'Mirror should be detached from dresser for pickup.' },
        { i: 'Foundation', t: 'We do not accept Hospital or Sleep Number beds. Must be disassembled for pick up.' },
        { i: 'Head/Foot', t: 'Must be disassembled for pick up.' },
        { i: 'Mattress', t: '5 yrs or younger, must have original manufacturing tags attached, No rips, stains or tears.' },
        { i: 'Mirror', t: msg.mirror },
        { i: 'Nightstand', t: msg.solid },
        { i: 'Shelving', t: msg.solid },
        { i: 'Trundle Bed', t: 'Must be disassembled for pick up.' },
        { i: 'Wardrobe', t: msg.solid },
      ],
      'Dining Room': [
        { i: 'Bench', t: msg.solid },
        { i: 'Buffet', t: msg.solid },
        { i: 'Cart', t: msg.solid },
        { i: 'Chest', t: msg.solid },
        { i: 'China Cabinet', t: msg.solid },
        { i: 'Corner Cabinet', t: msg.solid },
        { i: 'Dining Table', t: msg.solid },
        { i: 'Dining Chair', t: msg.solid },
        { i: 'Liquor Cabinet', t: msg.solid },
        { i: 'Wine Rack', t: '' },
      ],
      'Kitchen': [
        { i: 'Accessories', t: msg.pickup },
        { i: 'Barstool', t: msg.rip },
        { i: 'Cabinet', t: 'Doors and drawers must be included.' },
        { i: 'Cooktop', t: msg.appl },
        { i: 'Countertop', t: 'Kitchen counter tops- no cut outs, straight pieces only.' },
        { i: 'Dishwasher', t: 'Dishwasher must be 5 years old or new, in full working order, and not missing parts or pieces. Must be disconnected.' },
        { i: 'Freezer', t: msg.appl },
        { i: 'Household', t: msg.appl },
        { i: 'Housewares', t: 'We accept glassware, pots, pans, art decor, figurines, etc. Pickup only as part of a larger donation.' },
        { i: 'Kitchen Chair', t: msg.rip },
        { i: 'Kitchen Table', t: msg.solid },
        { i: 'Kitchen Sink', t: 'Removal of faucet preferred. No chips, spider veins or deep scratches in finish.' },
        { i: 'Microwave', t: msg.appl },
        { i: 'Oven', t: msg.appl },
        { i: 'Range', t: msg.appl },
        { i: 'Range Hood', t: msg.appl },
        { i: 'Refigerator', t: msg.appl },
      ],
      'Laundry': [
        { i: 'Clothes Dryer', t: msg.appl + ' Must be disconnected from gas, electric and dryer vent.' },
        { i: 'Washing Machine', t: msg.appl + ' Must be disconnected.' },
        { i: 'Washer/Dryer Combo', t: msg.appl + ' Must be disconnected from gas, electric and dryer vent.' },
  
      ],
      'Living Room': [
        { i: 'Arm Chair', t: msg.rip },
        { i: 'Bean Bag', t: msg.rip },
        { i: 'Bookshelf', t: msg.solid },
        { i: 'Chair', t: msg.solid },
  
        { i: 'Coffee Table', t: msg.solid },
        { i: 'End Table', t: msg.solid },
        { i: 'Love Seat', t: '' },
        { i: 'Media Center', t: msg.solid },
        { i: 'Mirror', t: msg.mirror },
  
        { i: 'Ottoman', t: msg.rip },
  
        { i: 'Recliner', t: msg.rip },
        { i: 'Sectional', t: msg.rip },
        { i: 'Shelving', t: msg.solid },
        { i: 'Sleeper Sofa', t: 'In working condition. ' + msg.rip },
  
        { i: 'Sofa', t: msg.rip },
        { i: 'Sofa Table', t: msg.solid },
        { i: 'Storage', t: msg.solid },
        { i: 'TV Flat Screen', t: 'Flat screen TVs (5 yrs or younger). ' + msg.pickup },
        { i: 'TV Stand', t: msg.solid },
      ],
      'Office': [
        { i: 'Bookcase', t: msg.solid },
        { i: 'Credenza', t: msg.solid },
        { i: 'Desk', t: 'Desk must be 5 X 3 or smaller. ' + msg.solid },
        { i: 'File Cabinet', t: 'Metal or ' + msg.solid },
        { i: 'Office Chair', t: msg.rip },
        { i: 'Printer Stand', t: msg.solid },
      ],
      'Patio': [
        { i: 'Fencing', t: 'Fencing, must be a min of 10 ft, chicken wire min 25 ft.' },
        { i: 'Hammock', t: '' },
        { i: 'Landscape Tools', t: msg.pickup },
        { i: 'Outdoor Bed', t: '' },
        { i: 'Outdoor End Table', t: '' },
        { i: 'Outdoor Sofa', t: '' },
        { i: 'Storage Box', t: '' },
        { i: 'Patio Chair', t: '' },
        { i: 'Patio Table', t: '' },
        { i: 'Sunshade', t: '' },
        { i: 'Grill', t: 'Propane taniks not accepted.' + msg.appl },
  
      ],
      'Home Improvement': [
        { i: 'Area rug', t: 'Finished edges must be intact with no fraying.' },
        { i: 'Heating/Cooling', t: 'Gas or electric. Must be less than 15 years old. Must be removed properly and capped.' },
        { i: 'Blinds', t: 'Must be fully functioning and include all mounting hardware and accessories. We only accept vertical blinds that are brand new, in box.' },
        { i: 'Carpet', t: 'Carpet min 100 sq ft, no padding.' },
        { i: 'Fasteners / Hardware', t: 'Pick up only if included as part of larger donation.' },
        { i: 'Decking', t: 'Wood or composite. Must be in good condition with no rot, nails, or screws. Minimum of 100 sq ft for pickup.' },
        { i: 'Drywall', t: 'Full or half sheets only. No holes. Minimum of 5 full sheets for pickup.' },
        { i: 'Insulation', t: 'New only. Minimum of 4 full rolls for pickup.' },
        { i: 'Lumber', t: 'Unused lumber 8 ft or larger, no holes, no splitting or water damage.' },
        { i: 'Plywood', t: 'Must be at least 6 feet long and free of nails, screws and holes.' },
        { i: 'Trim/Molding', t: 'Must be at least 6 feet long and free of nails, screws and holes.' },
        { i: 'Tile', t: 'Ceramic, porcelain, marble, granite. New only. Must be full pieces ready to install. Minimum of 1 full box.' },
        { i: 'Flooring', t: 'Full pieces only. Minimum of 100 sq feet for pickup.' },
        { i: 'Sporting Goods', t: 'In working condition.' },
        { i: 'Housewares', t: '' },
        { i: 'Door', t: 'Must be not have any holes or deep scratches.' },
        { i: 'Sliding Glass Door', t: 'Sliding glass door w/ frame 48-72 X 80.' },
        { i: 'Lamp', t: 'Must include shade if applicable.' },
  
        { i: 'Light Fixture', t: 'Ceiling, can lights, hanging, wall mount, and exterior lights. Must include glass or globes.' },
        { i: 'Ladder', t: 'We do not accept wooden ladders. Must be in good working condition.' },
        { i: 'Lawn Mower', t: msg.working },
        { i: 'Vacuum', t: msg.working },
        { i: 'Tools', t: msg.working },
        { i: 'Window', t: 'Windows must be double-paned, in casings, and not just sashes.' },
      ],
  
    }
  
    return (
      <>
        {isOpen &&
          <>
            <Button onClick={(e: any) => handleClear(e)}>Reset</Button>
            <Button disabled={areItemsEmpty(customItems)} onClick={(e: any) => setDone(e)}>Save/Done</Button>
            <ToastContainer position="top-left" className='mytoast' autoClose={3000} hideProgressBar={true} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
            <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
              <DonateType title='Bathroom:' hasCustom={'text'} chosen={donations} products={products.Bathroom} customItems={customItems} setCustomItems={(e: any) => setCustomItems(e)} customIdx={0} onClick={(e: any, i: any, l: any, t: string, b: number) => { handleProducts(e, i, l, t, b) }} />
              <DonateType title='Bedroom:' hasCustom={'text'} chosen={donations} products={products.Bedroom} customItems={customItems} setCustomItems={(e: any) => setCustomItems(e)} customIdx={1} onClick={(e: any, i: any, l: any, t: string, b: number) => { handleProducts(e, i, l, t, b) }} />
              <DonateType title='Dining Room:' hasCustom={'text'} chosen={donations} products={products['Dining Room']} customItems={customItems} setCustomItems={(e: any) => setCustomItems(e)} customIdx={2} onClick={(e: any, i: any, v: number, t: string, b: number) => { handleProducts(e, i, v, t, b) }} />
              <DonateType title='Laundry:' hasCustom={'text'} chosen={donations} products={products['Laundry']} customItems={customItems} setCustomItems={(e: any) => setCustomItems(e)} customIdx={3} onClick={(e: any, i: any, v: number, t: string, b: number) => { handleProducts(e, i, v, t, b) }} />
  
              <DonateType title='Living Room:' hasCustom={'text'} chosen={donations} products={products['Living Room']} customItems={customItems} setCustomItems={(e: any) => setCustomItems(e)} customIdx={4} onClick={(e: any, i: any, v: number, t: string, b: number) => { handleProducts(e, i, v, t, b) }} />
              <DonateType title='Kitchen:' hasCustom={'text'} chosen={donations} products={products['Kitchen']} customItems={customItems} setCustomItems={(e: any) => setCustomItems(e)} customIdx={5} onClick={(e: any, i: any, v: number, t: string, b: number) => { handleProducts(e, i, v, t, b) }} />
  
              <DonateType title='Office:' hasCustom={'text'} chosen={donations} products={products['Office']} customItems={customItems} setCustomItems={(e: any) => setCustomItems(e)} customIdx={6} onClick={(e: any, i: any, v: number, t: string, b: number) => { handleProducts(e, i, v, t, b) }} />
              <DonateType title='Patio:' hasCustom={'text'} chosen={donations} products={products['Patio']} customItems={customItems} setCustomItems={(e: any) => setCustomItems(e)} customIdx={7} onClick={(e: any, i: any, v: number, t: string, b: number) => { handleProducts(e, i, v, t, b) }} />
              <DonateType title='Home Improvement:' hasCustom={'text'} chosen={donations} products={products['Home Improvement']} customItems={customItems} setCustomItems={(e: any) => setCustomItems(e)} customIdx={8} onClick={(e: any, i: any, v: number, t: string, b: number) => { handleProducts(e, i, v, t, b) }} />
  
            </Accordion>
          </>}
      </>
    )


  }

  interface IType {
    products: Iitems
    chosen: Iprods
    hasCustom: string
    customItems: any
    customIdx: number
    setCustomItems: Function
    title?: string
    onClick: Function
  }
  function DonateType({ products, title, chosen, hasCustom, customItems, customIdx, setCustomItems, onClick }: IType) {
    const handleClick = (e: string, id: number, t: string, b: number) => {
      console.log('DonateType', e, id)
      onClick(e, id, products, t, b)
    }
  
    return (
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            {title}
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <TilesMulti tiles={products} chosen={chosen} hasCustom={hasCustom} customItems={customItems} setCustomItems={(e: any) => setCustomItems(e)} customIdx={customIdx} onClick={(e: any, i: any, t: string, b: number) => handleClick(e, i, t, b)} />
        </AccordionItemPanel>
      </AccordionItem>
    )
  
  }
  