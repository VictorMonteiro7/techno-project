const vm = new Vue({
  el: "#app",
  data: {
    produtos: {},
    produto: false,    
    carrinho: [],
    mensagemAlerta: "Item adicionado",
    alertaAtivo: false,
    carrinhoAtivo: false    
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
    clickForaCarrinho({target, currentTarget}){
      if(target === currentTarget)
      this.carrinhoAtivo = false;  
    },
    abrirModal(id){
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })      
    },
    adicionarItem(){              
      if(this.produto.estoque > 0){    
        this.produto.estoque--;
        const {id, nome, preco} = this.produto;
        this.carrinho.push({id, nome, preco});
        this.alerta(`${nome} foi adicionado ao carrinho`)
      }   
    },
    removerItem(index){
      this.carrinho.splice(index, 1)
    },
    checarLocalStorage(){
      if(window.localStorage.carrinho){
        this.carrinho = JSON.parse(localStorage.carrinho);
      }
    },
    alerta(mensagem){
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(()=>{
        this.alertaAtivo = false;
      },1500)
    },
    router(){
      const hash = document.location.hash;
      if(hash){
        this.fetchProduto(hash.replace('#', ''))
      }
    },
    compararEstoque(){
      const itens = this.carrinho.filter(({id})=> id === this.produto.id)
      this.produto.estoque -= itens.length;
    }     
  },
  computed: {
    carrinhoTotal(){
      let total = 0;
      if(this.carrinho.length){
        this.carrinho.forEach(item=>{
          total += item.preco;
        })
      }
      return total;
    }
  },
  created(){
    this.fetchProdutos();
    this.checarLocalStorage();
    this.router();
  },
  filters: {
    numeroPreco(valor){      
      return valor.toLocaleString('pt-BR',{style: "currency",currency:"BRL"})
    }
  },
  watch: {
    carrinho(){
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    },
    produto(){
      document.title = this.produto.nome || "Techno";
      const hash = this.produto.id || '';
      history.pushState(null, null, `#${hash}`);
      if(this.produto)
        this.compararEstoque()         
    }
  }
})