

    (func   $task2.createElement                                                                               (type $i32->)
        (local i32)

        call($self.Reflect.apply<ext3>ext
            self.Document.prototype.createElement
            (#document)
            call($self.Array.of<ext>ext param(0)#)) 
                
        i32(1) local(set 1 table(grow $ext))

        call($set<stack*.result> call($get<event*>param $0) $1)
        call($set<event*.state> $0 EVENT_STATE_DONE)        
    )


    (func   $task2.setAttibute                                                                                 (type $i32->)

        call($self.Reflect.apply<ext3>
            self.Element.prototype.setAttribute 
            param(0)# 
            call($self.Array.of<ext.i32>ext param(1)# param(2)))

        call($set<event*.state> $0 EVENT_STATE_DONE)
    )


