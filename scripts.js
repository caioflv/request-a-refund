const form = document.querySelector("form")
const ul = document.querySelector(".item-list ul")

const expenseNameEmt = document.getElementById("expenseName")
const categoryEmt = document.getElementById("category")
const amountEmt = document.getElementById("amount")
const expenseCounterEmt = document.querySelector(".summary label")
const totalAmountEmt = document.querySelector(".totalAmount")

const categories = ["food", "accommodation", "transport", "services", "other"]

let amountCents = 0
let totalAmount = 0
let lastItemId = 0
let expenses = []

form.onsubmit = (event) => {
	event.preventDefault()

	addItem()
}

amountEmt.oninput = () => {
	amountEmt.value = formatAmountTxt(amountEmt.value)
}

function formatAmountTxt(txt) {
	txt = String(txt).replace(/\D/g, "")
	amountCents = Number(txt) / 100
	return formatCurrencyUSD(amountCents)
}

function formatCurrencyUSD(value) {
	value = value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
	})
	return value
}

function addItem() {
	if (
		expenseNameEmt.value === "" ||
		categoryEmt.value === "" ||
		amountEmt.value === ""
	) {
		return
	}

	let imgUrl = ""
	let selectedCategory = String(categoryEmt.value).toLowerCase()
	if (categories.includes(selectedCategory)) {
		imgUrl = `./assets/icons/${selectedCategory}.svg`
	}

	const li = document.createElement("li")
	li.classList.add("item")
	li.id = lastItemId

	li.innerHTML = `
            <img src="${imgUrl}" alt="" />
            <div>
                <span>${expenseNameEmt.value}</span>
                <span>${categoryEmt.value}</span>
            </div>
            <div>
                <span>US$</span>
                <span>${amountEmt.value}</span>
            </div>
            <button type="button" onclick="removeItem(this, ${lastItemId})">
                <img src="./assets/icons/remove.svg" alt="" />
            </button>
    `
	expenses.push({
		id: lastItemId,
		amount: amountCents,
	})

	ul.prepend(li)

	updateSummary()

	lastItemId++

	amountCents = 0
	expenseNameEmt.value = ""
	categoryEmt.value = ""
	amountEmt.value = ""
}

function removeItem(btn, itemId) {
	const index = expenses.findIndex((e) => e.id === itemId)
	expenses.splice(index, 1)

	btn.closest("li").remove()

	updateSummary()
}

function updateSummary() {
	totalAmount = 0
	for (let i = 0; i < expenses.length; i++) {
		totalAmount += expenses[i].amount
	}
	totalAmountEmt.textContent = formatCurrencyUSD(totalAmount)
	expenseCounterEmt.textContent =
		ul.children.length + ul.children.length > 1 ? "expenses" : "expense"
}
