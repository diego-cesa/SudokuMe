import React, { Component } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import Drawer from 'react-native-drawer';
import AppHeader from '../component/AppHeader';
import AppFooter from '../component/AppFooter';
import SudokuGrid from '../component/SudokuGrid';
import Menu from '../component/Menu'

import { SolveSudoku, MatrixToArray, ArrayToMatrix } from '../source/functions';

var Styles = require('../resources/styles');
var Games = require('../resources/games');
var Constants = require('../source/constants');


export default class Main extends Component {

    constructor(props){
        super(props);
        this.state = { 
            game: Games.medium[0],
            sudokuPrint: MatrixToArray(Games.medium[0]),
            menuOpen: false,
            editMode: false,
            buttonState: Constants.BUTTON_SOLVE,
        }

        this.solveClick = this.solveClick.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.restart = this.restart.bind(this);
        this.newGame = this.newGame.bind(this);
        this.createGame = this.createGame.bind(this);
        this.saveGame = this.saveGame.bind(this);
        this.updateCel = this.updateCel.bind(this);
    }

    solveClick(){
        // this.setState({buttonState: Constants.BUTTON_SOLVING})
        var result = SolveSudoku(this.state.game);
        if(result != false){
            this.setState({
                sudokuPrint: result,
                buttonState: Constants.BUTTON_RESTART
            });
        }
        else{
            Alert.alert(
                'Oops',
                'I can not solve this puzzle',
                [{text: 'Ok'}]
              )
        }
    }

    openMenu(){
        this.setState({menuOpen: true});
    }

    closeMenu(){
        this.setState({menuOpen: false});
    }

    restart(){
        this.setState({
            sudokuPrint: MatrixToArray(this.state.game),
            menuOpen: false,
            buttonState: Constants.BUTTON_SOLVE
        });
    }

    newGame(difficulty){

        var game = Games[difficulty][Math.floor(Math.random() * Games[difficulty].length)];
        this.setState({
            game: game,
            sudokuPrint: MatrixToArray(game),
            menuOpen: false,
            editMode: false,
        })
    }

    createGame(){
        this.setState({
            sudokuPrint: MatrixToArray(Games.clear),
            editMode: true,
            menuOpen: false
        });
    }

    updateCel(value, index){
        if(value=="" || (value >= 1 && value <= 9)){
            var sudokuPrint = this.state.sudokuPrint;
            sudokuPrint[index] = value;
            this.setState({sudokuPrint});
        }
    }
    saveGame(){
        this.setState({
            editMode: false,
            game: ArrayToMatrix(this.state.sudokuPrint)
        });
    }

    render() {
        return(
            <View style={Styles.mainContainer}>

                <Drawer
                    open={this.state.menuOpen}
                    openDrawerOffset={150}
                    captureGestures={"closed"}
                    side="right"
                    tapToClose={true}
                    type="overlay"
                    tweenHandler={(ratio) => ({
                        main: { opacity:(2-ratio)/2 }
                      })}
                    content={ 
                        <Menu closeMenu={this.closeMenu} 
                            restart={this.restart}
                            newGame={this.newGame} 
                            createGame={this.createGame} 
                        /> 
                    }
                >

                    <ScrollView keyboardShouldPersistTaps="always">
                        <KeyboardAvoidingView behavior="padding" enabled>
                            <AppHeader openMenu={this.openMenu}/>
                            <SudokuGrid sudoku={this.state.sudokuPrint} 
                                editMode={this.state.editMode}
                                updateCel={this.updateCel}/>
                            
                        </KeyboardAvoidingView>
                    </ScrollView>

                    <AppFooter solveClick={this.solveClick} 
                                saveGame={this.saveGame}
                                editMode={this.state.editMode}
                                buttonState={this.state.buttonState}
                                restart={this.restart}/>
                </Drawer>
            </View>
        )
    }
}