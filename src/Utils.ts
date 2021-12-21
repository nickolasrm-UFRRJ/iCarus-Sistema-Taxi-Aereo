/**
 * Copia e remove as horas de um Date
 * @param date 
 * @returns Date
 */
function removeTime(date: Date): Date{
    date = new Date(date)
    date.setHours(0, 0, 0, 0)
    return date
}

/**
 * Verifica se duas datas são iguais ignorando horas
 * @param dateA 
 * @param dateB 
 * @returns boolean
 */
function isEqual(dateA: Date, dateB: Date): boolean{
    let a = removeTime(dateA)
    let b = removeTime(dateB)
    return ((a.getTime() - b.getTime()) == 0)
}

export {isEqual}
