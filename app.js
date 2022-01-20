const vm = new Vue({
  el: "#app",
  data: {
    produtos: {},
    produto: false,
    carrinhoTotal: 0,
    carrinho: []
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
    },
    adicionarItem(){      
      const botaoCompra = this.$refs['btn'];      
      let estoque = this.produto.estoque;         
      if(estoque > 0){    
        estoque--;
        this.produto.estoque = estoque;
        this.carrinhoTotal++;           
      }   
      if(estoque === 0){
        botaoCompra.innerText = "Produto esgotado";
        botaoCompra.disabled = true;
      }
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