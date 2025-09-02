/**
 *  map liite map
 *  aim mode - third viewer
 *  distance calc
 *  health - armor - equipment - shield
 *  skill tree
 *  technology tree
 *  type of weapon SAP HE AP AM APCR VT 
 *  radar
 *  aircarft
 */
//c++
export class BaseCharacter{
    private baseName: string = '';
    //...

    //needOverride



    //getter setter

}

// mesh.physics => this.object(BaseCharacter) & this.object(damgemesh)
// ?.function(object, object2)
// 

export function myfun(target:any, trigger:any , refFromPhysics:any){
    /**
     * 
     */
    const triggerType = trigger.getType();
    const targetDef = target.getDef();
    const angle = trigger.getAngle();

    switch(triggerType){
        case 0:
            break; //APFSDS
        
        case 1:
            break;//HE
        
        case 2:
            break;//AP
        
        case 3:
            break;//AM
        
        case 4:
            break;//SAP
        default:
            break;
    }

}

