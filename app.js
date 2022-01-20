const vm = new Vue({
  el: "#app",
  data: {
    produtos: {}
  },
  methods: {
    fetchProdutos(){
      fetch('./api/produtos.json')
      .then(r=>r.json())
      .then(json=>this.produtos = json)
    }    
  },
  created(){
    this.fetchProdutos()
  }
})