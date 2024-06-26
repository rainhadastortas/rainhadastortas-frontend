import { createContext, ReactNode, useEffect, useState } from "react"

import { Toast, ToastAlerta } from "../utils/ToastAlerta"
import { login } from "../services/Service"

import UsuarioLogin from "../models/UsuarioLogin"
import Produto from "../models/Produto";

interface AuthContextProps {
  usuario: UsuarioLogin;
  handleLogout(): void;
  handleLogin(usuario: UsuarioLogin): Promise<void>;
  isLoading: boolean;
  produtos: Produto[]
  adicionarProduto: (produto: Produto) => void
  removerProduto: (id: number) => void
  aumentarProduto: (produto: Produto) => void
  diminuirProduto: (produto: Produto) => void
  quantidadeProdutos: number
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({ children }: AuthProviderProps) {
  
  const [carrinho, setCarrinho] = useState<Produto[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const quantidadeProdutos = produtos.length;

  const [usuario, setUsuario] = useState<UsuarioLogin>({
    id: 0,
    nome: "",
    usuario: "",
    senha: "",
    token: ""
  });

  async function handleLogin(userLogin: UsuarioLogin) {
    setIsLoading(true);

    try {
      await login(`/usuarios/logar`, userLogin, setUsuario);
      ToastAlerta('Seja bem-vindo!', Toast.Sucess);
    } catch (error: any) {
      ToastAlerta('Usuário ou senha não encontrado', Toast.Warning);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    setUsuario({
      id: 0,
      nome: "",
      usuario: "",
      senha: "",
      token: ""
    });
  }

  function adicionarProduto(produto: Produto) {
    setProdutos((state) => {
      const produtoExistente = state.find((item) => item.id === produto.id);
      let novoCart;

      if (!produtoExistente) {
        novoCart = [...state, { ...produto, quantidade: 1, total: produto.valor }];
        ToastAlerta('Produto adicionado ao carrinho', Toast.Sucess)
      } else {
        novoCart = [...state];
        ToastAlerta('Produto já existe no carrinho', Toast.Info)
      }

      localStorage.setItem('produtosNoCarrinho', JSON.stringify(novoCart));
      return novoCart;
    });
  }

  function aumentarProduto(produto: Produto) {
    setProdutos((state) => {
      const produtoExistente = state.find((item) => item.id === produto.id);
      if (produtoExistente && produtoExistente.quantidade) {
        const novoCart = state.map((item) =>
          item.id === produto.id ? {
            ...item,
            quantidade: item.quantidade + 1,
            total: ((item.quantidade + 1) * item.valor)
          } : item
        );

        localStorage.setItem('produtosNoCarrinho', JSON.stringify(novoCart));
        return novoCart;
      }
    });
  }

  function diminuirProduto(produto: Produto) {
    setProdutos((state) => {
      const produtoExistente = state.find((item) => item.id === produto.id);
      if (produtoExistente) {
        const novoCart = state.map((item) =>
          item.id === produto.id ? {
            ...item,
            quantidade: item.quantidade - 1,
            total: ((item.quantidade - 1) * item.valor)
          } : item
        );
        localStorage.setItem('produtosNoCarrinho', JSON.stringify(novoCart));
        return novoCart;
      }
    });
  }

  function removerProduto(id: number) {
    const produtosExistentes = produtos.filter((produto) => produto.id !== id);
    setProdutos(produtosExistentes);
    localStorage.setItem('produtosNoCarrinho', JSON.stringify(produtosExistentes));
  }

  useEffect(() => {
    const salvarCarrinho = localStorage.getItem('produtosNoCarrinho');
    if (salvarCarrinho) {
      setProdutos(JSON.parse(salvarCarrinho));
    }
  }, []);

  useEffect(() => {
    const salvarCarrinho = localStorage.getItem('produtosNoCarrinho');
    if (salvarCarrinho) {
      setCarrinho(JSON.parse(salvarCarrinho));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        handleLogin,
        handleLogout,
        isLoading,
        produtos,
        adicionarProduto,
        removerProduto,
        aumentarProduto,
        diminuirProduto,
        quantidadeProdutos,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}