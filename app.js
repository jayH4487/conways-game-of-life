class App {
    constructor() {
        this.rows = 10
        this.columns = 10
        this.grid = this.createGrid()

        this.$grid = document.querySelector(".grid")
        this.$next = document.querySelector(".next")
        
        this.displayGrid(this.grid)
        this.addEventListeners()
    }

    addEventListeners() {
        this.$next.addEventListener("click", () => this.handleNextClick())
        this.$grid.addEventListener("click", (e) => this.handleGridClick(e))
        this.$grid.addEventListener("mousedown", (e) => this.handleGridMousedown(e))
    }


    createGrid() {
        const grid = Array(this.rows)
            .fill(0)
            .map(_ => Array(this.columns).fill(0))

       
        return grid
        
    }

    updateGrid(grid) {

        const north = (arr, rowIndex, colIndex) =>      arr[rowIndex - 1][colIndex + 0]
        const northEast = (arr, rowIndex, colIndex) =>  arr[rowIndex - 1][colIndex + 1]
        const east = (arr, rowIndex, colIndex) =>       arr[rowIndex - 0][colIndex + 1]
        const southEast = (arr, rowIndex, colIndex) =>  arr[rowIndex + 1][colIndex + 1]
        const south = (arr, rowIndex, colIndex) =>      arr[rowIndex + 1][colIndex + 0]
        const southWest = (arr, rowIndex, colIndex) =>  arr[rowIndex + 1][colIndex - 1]
        const west = (arr, rowIndex, colIndex) =>       arr[rowIndex + 0][colIndex - 1]
        const northWest = (arr, rowIndex, colIndex) =>  arr[rowIndex - 1][colIndex - 1]

        const getNeighbours = (arr, rowIndex, colIndex) => {

            const reducer = (acc, fn) => acc + fn(arr, rowIndex, colIndex)

            if (rowIndex === 0 && colIndex === 0) {
                return [east, southEast, south].reduce(reducer, 0)
            }
            if (rowIndex === 0 && colIndex === this.columns - 1) {
                return [south, southWest, west].reduce(reducer, 0)
            }
            if (rowIndex === this.rows - 1 && colIndex === this.columns - 1) {
                return [west, northWest, north].reduce(reducer, 0)
            }
            if (rowIndex === this.rows - 1 && colIndex === 0) {
                return [north, northEast, east].reduce(reducer, 0)
            }
            if (rowIndex === 0) {
                return [east, southEast, south, southWest, west].reduce(reducer, 0)
            }
            if (colIndex === this.columns - 1) {
                return [south, southWest, west, northWest, north].reduce(reducer, 0)
            }
            if (rowIndex === this.rows - 1) {
                return [west, northWest, north, northEast, east].reduce(reducer, 0)
            }
            if (colIndex === 0) {
                return [north, northEast, east, southEast, south].reduce(reducer, 0)
            }
            return [north, northEast, east, southEast, south, southWest, west, northWest]
                .reduce(reducer, 0)
        }

        const liveOrDie = (el, arr, rowIndex, colIndex) => {
            const neighbours = getNeighbours(arr, rowIndex, colIndex)
            
            const res = el === 0 && neighbours === 3 ? 1 :
            el === 1 && (neighbours === 2 || neighbours === 3) ? 1 :
            el = 0
            console.log([el, rowIndex, colIndex, neighbours, res])
            
            return res
        }

        return grid.map(
            (rowElement, rowIndex, arr) => rowElement.map(
                (colElement, colIndex) => liveOrDie(colElement, arr, rowIndex, colIndex) )
            )
        
        
    }

    handleNextClick() {
        this.grid = this.updateGrid(this.grid)
        this.displayGrid(this.grid)
    }

    handleGridClick(e) {

        if (e.detail > 1) e.preventDefault()
        const [x, y] = e.target.dataset.cell.split(",").map(Number)
        // console.log([x, y])
        this.grid = this.grid
            .map(
                (row, rowI) => row.map(
                    (el, colI) => rowI === y && colI === x ? Math.abs(el - 1) : el))
        
        this.displayGrid(this.grid)
    }

    handleGridMousedown(e) {
        if (e.detail > 1) e.preventDefault()
    }
    


    displayGrid(grid) {
        this.$grid.innerHTML = grid
            .map(
                (row, y) => row.map(
                    (el, x) => `
                    <rect
                        data-cell=${[x,y]}
                        x=${x * 40}
                        y=${y * 40}
                        width="40"
                        height="40"
                        style="fill:${el === 1 ? "black" : "white"};stroke-width:1;stroke:grey"
                    />
                    `
                ).join("")
            ).join("")
    }

}

const app = new App()