<script lang="tsx">
import { ref, computed, ComputedRef, defineComponent, PropType } from 'vue'
import { api, request } from '../Request'
import Toolbar from './Toolbar.vue';
import PageBody from './PageBody.vue';
import { eval_template, Template, DeployInfo, DeployOption } from '../Model';
import { ElPopover } from 'element-plus';
import mdui from 'mdui';

interface DeployHistoryComputed {
    deployId: string,
    deployTemplate?: Template,
    deployType?: DeployOption,
    userVerify?: DeployOption,
    deployAddition: DeployOption[],
    price: number,
    pagePath: string,
    deployTime: Date,
    deployOptions: (DeployOption | undefined)[],
}

const DeployHistoryCard = defineComponent({
    name: "DeployHistoryCard",
    props: {
        deploy_history: {
            type: Object as PropType<DeployHistoryComputed>,
            required: true,
        }
    },
    setup(props) {
        return () => {
            const { deploy_history } = props;
            return (
                <div class="mdui-col-xs-12 mdui-col-sm-6 mdui-col-md-4" style="margin: 16px 0;">
                    <div class="mdui-card">
                        <div class="mdui-card-media">
                            <img src={api(`thumbnail/${deploy_history.deployTemplate?.tid}`)} class="image-preview-cover" />
                            <div class="mdui-card-primary mdui-card-media-covered">

                                <div class="mdui-card-primary-title">{deploy_history.deployTemplate?.title || ''}</div>
                                <div class="mdui-card-primary-subtitle">{deploy_history.deployTime.toLocaleString()}</div>
                            </div>
                        </div>
                        <div class="mdui-card-actions">
                            <ElPopover v-slots={{
                                reference: () => {
                                    return (<button class='mdui-btn'><i class="mdui-icon material-icons">payment</i> ¥{deploy_history.price / 100}</button>)
                                },
                                default: () => {
                                    return (
                                        <div class='mdui-list mdui-list-dense'>
                                            {
                                                deploy_history.deployOptions.map(option => {
                                                    return (
                                                        <div class='mdui-list-item'>
                                                            <div class="mdui-list-item-content">
                                                                <div class="mdui-list-item-title">{option?.name} ¥{(option?.price || 0) / 100}</div>
                                                                <div class="mdui-list-item-text mdui-list-item-one-line">
                                                                    <span class="mdui-text-color-grey">{option?.description}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                    )
                                }
                            }} width={350}>

                            </ElPopover>
                            <a class="mdui-btn mdui-btn-icon mdui-float-right" href={api(`page/release/${deploy_history.pagePath}`)}>
                                <i class="mdui-icon material-icons" mdui-tooltip="{content: '访问页面'}">web</i>
                            </a>
                            <a class="mdui-btn mdui-btn-icon mdui-float-right" href={`/deploy/statistics?did=${deploy_history.deployId}`}>
                                <i class="mdui-icon material-icons" mdui-tooltip="{content: '查看数据'}">pie_chart_outlined</i>
                            </a>
                        </div>
                    </div>
                </div>
            )
        }
    }
})

export default {
    name: "DeployHistoryPage",
    components: {
        Toolbar,
        PageBody,
        DeployHistoryCard
    }
}
</script>


<script setup lang="tsx">
const deploy_history = ref<DeployInfo[]>([]);
const all_templates = ref<Template[]>([]);
const DEPLOY_OPTION_GROUP = ref<{
    DEPLOY_TYPE: DeployOption[],
    USER_VERIFY: DeployOption[],
    DEPLOY_ADDITION: DeployOption[],
}>({
    DEPLOY_TYPE: [],
    USER_VERIFY: [],
    DEPLOY_ADDITION: [],
})

const deploy_history_computed: ComputedRef<DeployHistoryComputed[]> = computed(() => {
    return deploy_history.value.map(value => {
        const template = all_templates.value.find(x => x.tid === value.deployTemplate);
        const deploy_type = DEPLOY_OPTION_GROUP.value.DEPLOY_TYPE.find(x => x.id === value.deployType);
        const user_verify = DEPLOY_OPTION_GROUP.value.USER_VERIFY.find(x => x.id === value.userVerify);
        const deploy_addition: DeployOption[] = [];
        value.deployAddition.map(item => {
            let option = DEPLOY_OPTION_GROUP.value.DEPLOY_ADDITION.find(x => x.id === item);
            if (option) {
                deploy_addition.push(option);
            }
        })
        const deploy_options: (DeployOption | undefined)[] = [deploy_type, user_verify, ...deploy_addition]
        return {
            deployId: value.deployId,
            deployTemplate: template,
            deployType: deploy_type,
            userVerify: user_verify,
            deployAddition: deploy_addition,
            price: value.price,
            pagePath: value.pagePath,
            deployTime: value.deployTime,
            deployOptions: deploy_options,
        }
    })
})

function get_deploy_hostory() {
    request("deploy/history", {}, (status, obj) => {
        if (status == 200 && obj?.code === 200 && obj.data !== null) {
            deploy_history.value = (obj.data.list as Array<any>).map(value => {
                return {
                    deployId: value.deployId,
                    deployTemplate: value.deployTemplate,
                    deployType: value.deployType,
                    userVerify: value.userVerify,
                    deployAddition: value.deployAddition.split(' '),
                    price: value.price,
                    pagePath: value.pagePath,
                    deployTime: new Date(value.deployTime),
                }
            })

            console.log(deploy_history_computed.value)
        } else {
            mdui.snackbar({
                message: obj?.message || "获取部署历史失败",
                position: 'bottom',
            });
        }
    })
}

function get_all_templates() {
    request("template/list", {}, (status, obj) => {
        if (status == 200 && obj?.code === 200 && obj.data !== null) {
            all_templates.value = (obj.data.templates as Array<any>).map(value => eval_template(value))
        }
    })
}

function get_deploy_option_group() {
    request("deploy/options", {}, (status, obj) => {
        if (status == 200 && obj?.code === 200 && obj.data !== null) {
            DEPLOY_OPTION_GROUP.value = obj.data
        }
    })
}

function goto_deploy_page() {
    window.location.href = '/deploy'
}

get_all_templates()
get_deploy_option_group()
get_deploy_hostory()
</script>


<template>
    <toolbar title="部署历史">
        <a class="mdui-btn mdui-btn-icon mdui-ripple" @click="goto_deploy_page">
            <i class="mdui-icon material-icons">cloud</i>
        </a>
    </toolbar>

    <page-body>
        <div class="mdui-container">
            <div v-for="history in deploy_history_computed">
                <deploy-history-card :deploy_history="history"></deploy-history-card>
            </div>
        </div>

    </page-body>

</template>