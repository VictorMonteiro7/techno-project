const vm = new Vue({
  el: "#app",
  data: {
    produtos: {},
    produto: false
  },
  methods: {
    fetchProdutos(){
      fetch('./api/produtos.json')
      .then(r=>r.json())
      .then(json=>this.produtos = json)
    },
    fetchProduto(id){
      fetch(`./api/produtos/${id}/dados.json`)
      .then(r=>r.json())
      .then(json=>this.produto = json)
    },
    fecharModal({target, currentTarget}){      
      if(target === currentTarget)
        this.produto = false;              
    },
    abrirModal(id){
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })      
    }     
  },
  created(){
    this.fetchProdutos()
  },
  filters: {
    numeroPreco(valor){      
      return valor.toLocaleString('pt-BR',{style: "currency",currency:"BRL"})
    }
  }
})