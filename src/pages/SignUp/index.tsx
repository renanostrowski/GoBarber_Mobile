import React, { useRef, useCallback } from 'react';
import {
  Image,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';

import Button from '../../components/Button';
import Input from '../../components/Input';

import LogoImg from '../../assets/logo.png';

import {
  Container, Title, BackToLogin, BackToLoginText,
} from './styles';
import getValidationErros from '../../utils/getValidationErros';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const handleSignUp = useCallback(async (data: FormData) => {
    try{

    formRef.current?.setErrors({})

    const schema = Yup.object().shape({
      name: Yup.string().required('Nome é obrigatório'),
      email: Yup.string().required('E-mail é obrigatório').email('Digite um E-mail válido'),
      password: Yup.string().required('Senha é obrigatória'),
    });

    await schema.validate(data, {
      abortEarly: false,
    });

    await api.post('/users', data);

    Alert.alert('Cadastro realizado com sucesso!', 'Você já pode fazer login na aplicação.');

    navigation.goBack();

    }catch(err){
      if(err instanceof Yup.ValidationError){
        formRef.current?.setErrors(getValidationErros(err));
        return;
      }

      Alert.alert('Erro ao realizar cadastro', 'Houve um erro ao realizar o cadastro, tente novamente mais tarde')
    }

  }, [navigation]);



  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={LogoImg} />

            <View>
              <Title>Crie sua conta</Title>
            </View>
            <Form
              ref={formRef}
              onSubmit={handleSignUp}
            >
              <Input autoCapitalize="words"
              name="name"
              placeholder="Nome"
              icon="user"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
              />

              <Input
              ref={emailInputRef}
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email"
              placeholder="E-mail"
              icon="mail"
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
              />

              <Input
              ref={passwordInputRef}
              name="password"
              placeholder="Senha"
              icon="lock"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="send"
              onSubmitEditing={() => {
                () => formRef.current?.submitForm();
              }}
              />

              <Button onPress={() => formRef.current?.submitForm()} >Cadastrar</Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToLogin>
        <BackToLoginText onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color="#f4ede8" />
          Voltar para o login
        </BackToLoginText>
      </BackToLogin>
    </>
  );
};

export default SignUp;
