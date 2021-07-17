// retorna os elementos que possuem "draggable" como class
const draggables = document.querySelectorAll(".draggable")
// retorna os elementos que possuem "container" como class
const containers = document.querySelectorAll(".container")










/* ===== EVENT LISTENER de draggable ===== */
/* -----> eles servirão para arrastar e parar de arrastar os draggables <----- */

// o "forEach()" serve para navegar pelos nossos draggable
draggables.forEach(draggable => {
    // agora que já tem acesso aos elementos do draggable, nós adicionamos Event Listeners
    // o "dragstart" é o que acontece quando começamos a arrastar os elementos, no primeiro clique
    draggable.addEventListener("dragstart", () => {
        // repare no ".add", ou seja, aqui ele está adicinando o dragging
        draggable.classList.add("dragging")
    })

    // vai ser o EventListener ativado quando o evento parar
    draggable.addEventListener("dragend", () => {
        // repare no ".remove", ou seja, aqui ele está removendo o dragging
        draggable.classList.remove("dragging")
    })
})










/* ===== EVENT LISTENER de container ===== */
/* fazem com que seja possível movimentar os draggables dentro dos containers e também mover para outros containers */

// o "forEach()" serve para navegar pelos nossos containers
// com eles, podemos determinar como vai funcionar quando arrastarmos ou removermos um elemento para dentro ou fora de um dos containers
containers.forEach(container => {
    // essa função será útil para determinar quando o elemento está sendo arrastado sobre um dos containers ou fora de qualquer um deles
    container.addEventListener("dragover", e => {
        // "e" é um event object, o "preventDefault()" remove o padrão que proíbe que um elemento seja arrastado para dentro de outro
        e.preventDefault()

    // vai ser o retornar a função "getDragAfterElement()"
    // vai capturar e definir a posição do mouse na nossa tela
    // "e.clientY" vai definir a posição do "y" na tela
    const afterElement = getDragAfterElement(container, e.clientY)
    // faz com que apenas o elemento tenha uma ".dragging" de cada vez
    const draggable = document.querySelector(".dragging")

    // vai funcionar se o nosso elemento for nulo
    // se for arrastado um elemento, não estiver sobre nenhum outro, ele irá para baixo na lista do container
    if (afterElement == null) {
        // adiciona uma ".dragging" para dentro de um dos containers
        container.appendChild(draggable)
    } 
    // esse else serve (obviamente) para fazer o oposto do if, ou seja, fazer com que o elemento que esteja sendo arrastado suba na lista
    else {
        container.insertBefore(draggable, afterElement)
    }
    })
})











/* função que vai determinar a posição do mouse que está arrastando o elemento */
/* também vai disponibilizar a posição do elemento anterior que ali está quando o mouse passar arrastando por cima dele */
function getDragAfterElement(container, y) {
    // determina quais são todos os elementos dentro do container que nós estamos passando o mouse por cima
    // o :not(.dragging) ignora todos os elementos que nós não estamos arrastando
    // está entre colchetes pois foi convertido em array para que possam ser feitas operações de arrays
    // por padrão querySelectorAll() não retorna uma array
    // agora, todos os "draggableElements" estão dentro de "container", que é parâmetro dessa mesma função
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
    
    // ".reduce()" vai permitir que seja possível navegar dentro do "draggableElements" e saber o elemento que está em seguida ao cursor
    // está se baseando no y que nós passamos para a função "getDragAfterElement()"
    // "closest": valor para o qual nós estamos reduzindo | é chamado assim pois é o mais próximo do cursor do mouse
    // "child": é chamado assim porque cada um deles são filhos do container do qual eles estão dentro
    // para cada um dos "draggableElements" a função "reduce()" será chamada e qualquer coisa que essa função retornar será o "closest"
    // o segundo parâmetro de reduce é apenas o valor inicial de "closest"
    return draggableElements.reduce((closest, child) => {
        // "getBoundingClientRect()": essa função vai nos dar os retângulos (medidas das childs [largura, x, y...]) para a variável box
        const box = child.getBoundingClientRect()
        // para saber a altura até a metade (meio) da box, nós vamos pegar o top e subtrair pela metade da altura da caixa
        // "y": posição y do mouse
        const offset = y - box.top - box.height / 2

        // se o número é positivo, significa que o elemento que não está sendo passando sobre os outros, mas está debaixo
        // por essa razão queremos um número menor que 0 (offset < 0)
        // também queremos os bem próximos de 0 possível (&& offset > closest.offset)
        // assim, esse será o nosso mais novo "closest" (o próximo do valor que nós queremos)
        if (offset < 0 && offset > closest.offset) {
            // devido a essa nova condição de máxima proximidade de um número negativo a 0, será retornado o seguinte objeto:
            return { offset: offset, element: child }
        } 
        // se for um valor maior que 0 ou se não é maior que o maior "closest" offset que há, será retornado o "closest"
        else {
            return closest
        }
    },
    // esse número é um negativo  de valor infinito, logo, qualquer outro elemento na lista (draggableElements) será mais "closest"
    // ele é utilizado para garantir que ele é o menor número, dessa maneira, qualquer offset é inicialmente maior que este offset padrão
    // o ".element" serve para obter o element da função "reduce()"
    { offset: Number.NEGATIVE_INFINITY }).element
}